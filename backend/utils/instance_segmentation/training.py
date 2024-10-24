
from initials import * 



def InstanceSegmentationTrainingPipeline(run_name,
                                    train_data_name,
                                    val_data_name,
                                    project_name,
                                    user_id,
                                    model_family,
                                    model_name,
                                    training_mode,
                                    batch_size,
                                    num_epochs,
                                    learning_rate,
                                    device,
                                    train_data_path,
                                    val_data_path):
    
    
    train_metadata = json.loads(open(os.path.join(train_data_path, "metadata.json")).read())
    val_metadata = json.loads(open(os.path.join(val_data_path, "metadata.json")).read())
    
    project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
    run_dir = os.path.join(project_info["project_dir"], "RUN_" + run_name + f"_{uuid.uuid4().__str__()}")
    os.makedirs(run_dir, exist_ok=True)
    
    data_dir = os.path.join(run_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    
        
    if model_family.lower().startswith("yolo"):

        import yaml
        
        os.makedirs(os.path.join(data_dir, 'images/train'), exist_ok=True)
        os.makedirs(os.path.join(data_dir, 'images/val'), exist_ok=True)
        os.makedirs(os.path.join(data_dir, 'labels/train'), exist_ok=True)
        os.makedirs(os.path.join(data_dir, 'labels/val'), exist_ok=True)
        
        train_samples = os.listdir(os.path.join(train_data_path, "images"))
        for sample in tqdm(train_samples, desc="train samples"):
            image_path = os.path.join(train_data_path, "images", sample)
            annotation_path = os.path.join(train_data_path, "annotations", sample[:-4] + ".json") # work for .jpg and .png
            base_name = os.path.basename(image_path)
        
            shutil.copy(image_path, os.path.join(data_dir, "images", "train"))
            
            with open(annotation_path) as f:
                data = json.load(f)
                segments = data['segments']
                image_size = data['size']
                yolo_segments = []
                for segment in segments:
                    segment_norm = []
                    for idx, val in enumerate(segment):
                        if idx % 2 == 0:
                            val = val / image_size[1]
                        else:
                            val = val / image_size[0]
                        if val > 1:
                            print(f"val > 1 : {val}")
                        segment_norm.append(val)
                    yolo_segments.append(segment_norm[:-2])
                class_ids = data['class_ids']
        
                label_file = open(os.path.join(data_dir, "labels", "train", f"{base_name[:-4]}.txt"), 'w')
                for class_id, segment in zip(class_ids, yolo_segments):
                    label_file.write(f"{class_id} {' '.join(map(str, segment))}\n")
                label_file.close()
        
        
        val_samples = os.listdir(os.path.join(val_data_path, "images"))
        for sample in tqdm(val_samples, desc="val samples"):
            image_path = os.path.join(val_data_path, "images", sample)
            annotation_path = os.path.join(val_data_path, "annotations", sample[:-4] + ".json") # work for .jpg and .png
            base_name = os.path.basename(image_path)
        
            shutil.copy(image_path, os.path.join(data_dir, "images", "val"))
            
            with open(annotation_path) as f:
                data = json.load(f)
                segments = data['segments']
                image_size = data['size']
                yolo_segments = []
                for segment in segments:
                    segment_norm = []
                    for idx, val in enumerate(segment):
                        if idx % 2 == 0:
                            val = val / image_size[1]
                        else:
                            val = val / image_size[0]
                        segment_norm.append(val)
                    yolo_segments.append(segment_norm[:-2])
                class_ids = data['class_ids']
        
                label_file = open(os.path.join(data_dir, "labels", "val", f"{base_name[:-4]}.txt"), 'w')
                for class_id, segment in zip(class_ids, yolo_segments):
                    label_file.write(f"{class_id} {' '.join(map(str, segment))}\n")
                label_file.close()
        
        
        # Create dataset.yaml
        dataset_yaml = {
            'train': os.path.join('images', 'train'),
            'val': os.path.join('images', 'val'),
            'nc': len(train_metadata['classes']),
            'names': train_metadata['classes']
        }

        data_config_path = os.path.join(data_dir, 'dataset.yaml')
        with open(data_config_path, 'w') as f:
            yaml.dump(dataset_yaml, f)
        
        print("Dataset conversion complete.")
        
        from ultralytics import YOLO
        if training_mode == "scratch":
            model = YOLO(f"{model_name}.yaml")
        elif training_mode == "finetune":
            model = YOLO(os.path.join(run_dir, "pretrained_model", f"{model_name}.pt"))
        elif training_mode == "transfer":
            model = YOLO(f"{model_name}.yaml").load(os.path.join(run_dir, "pretrained_model", f"{model_name}.pt"))
        model.info()
        
        class UltralyticsModelTrainingCallback:

            def __init__(self, run_name, run_dir, train_data_name, val_data_name, project_name, user_id):
                self.run_name = run_name   
                self.run_dir = run_dir
                self.train_data_name = train_data_name
                self.val_data_name = val_data_name
                self.project_name = project_name
                self.user_id = user_id
                print("Training Callback Setup Done!")
                self.epoch_avg_time = 0
                self.epoch_time_takens = []
                # self.log_file = "training_od_logs.txt"
                self.history = {
                    "epochs" : [],
                    "seg_loss" : [],
                    "class_loss" : [],
                    "precision" : [],
                    "recall" : [],
                    "MAP" : []
                }
                
                mongodb["training_history"].insert_one({"run_name" : run_name, "run_dir" : self.run_dir,  "project_name" : project_name,  "project_type" : "Object Detection", "train_data_name" : train_data_name, "val_data_name" : val_data_name, "user_id" : user_id, "model_path" : "", "history" : self.history, "classification_report" : "Will available after training!"})
    

            def on_train_epoch_start(self, trainer):
                self.model_path = str(trainer.best)
                self.epoch = trainer.epoch + 1
                self.epochs = trainer.epochs
                self.epoch_start_time = time.time()
                estimated_time = (self.epochs - self.epoch + 1) * self.epoch_avg_time
                self.estimated_time = f"{int(estimated_time // 60)}:{int(estimated_time % 60)} Minutes"
                # with open(self.log_file, "a") as f:
                #     f.writelines(f"Started Training Epoch [{self.epoch}/{self.epochs}]...")
                #     f.writelines(f"Estimated Time of Completation - {self.estimated_time}")
                
                training_status = f"Epoch : [{self.epoch}/{self.epochs}], Estimated Time : {self.estimated_time}"
                        
                update_query = {"run_name" : self.run_name, "train_data_name" : self.train_data_name, "val_data_name" : self.val_data_name, "project_name" : self.project_name, "user_id" : self.user_id}
                mongodb['run_records'].update_many(update_query, {'$set' : {"model_path" : self.model_path, "training_status" : training_status}})

                    
            def on_train_epoch_end(self, trainer):
                self.loss_items = trainer.loss_items.cpu().detach().numpy().tolist()
                self.label_loss_items = trainer.label_loss_items()      
                self.losses = {x:y for x,y in zip(self.label_loss_items, self.loss_items)}
                
            def on_val_end(self, trainer):
                self.metrics_dict = trainer.metrics.results_dict
                current_epoch_time_taken = time.time() - self.epoch_start_time
                self.epoch_time_takens.append(current_epoch_time_taken)
                self.epoch_avg_time = np.mean(self.epoch_time_takens)

                self.history["epochs"].append(f"{self.epoch}/{self.epochs}")
                self.history["seg_loss"].append(f"{round(self.losses['train/seg_loss'], 4)}")
                self.history["class_loss"].append(f"{round(self.losses['train/cls_loss'], 4)}")
                self.history["precision"].append(f"{round(self.metrics_dict['metrics/precision(M)'], 4)}")
                self.history["recall"].append(f"{round(self.metrics_dict['metrics/recall(M)'], 4)}")
                self.history["MAP"].append(f"{round(self.metrics_dict['metrics/mAP50(M)'], 4)}")
                
                
                update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
                mongodb['training_history'].update_many(update_query, {'$set' : {"model_path" : self.model_path, "history" : self.history}})


                # text = f'''
                # Training of Epoch [{self.epoch}/{self.epochs}] is Done.
                # Loss Items : {self.label_loss_items}
                # Losses : {self.loss_items}
                # Results : {self.metrics_dict},
                # model path : {self.model_path},
                # History Dict : {self.history}
                
                # \n
                # '''
                # with open(self.log_file, "a") as f:
                #     f.writelines(text)

        callback = UltralyticsModelTrainingCallback(run_name, run_dir, train_data_name, val_data_name, project_name, user_id)

        model.add_callback("on_train_epoch_start", callback.on_train_epoch_start)
        model.add_callback("on_train_epoch_end", callback.on_train_epoch_end)
        model.add_callback("on_val_end", callback.on_val_end)
        
        results = model.train(data=os.path.abspath(data_config_path), epochs=num_epochs, imgsz=640, batch=batch_size, workers=1, project=run_dir)
        
        best_model_path = mongodb['run_records'].find_one({"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id})['model_path']
        
        model = YOLO(best_model_path)
        
        results = model.val(data=os.path.abspath(data_config_path), batch=batch_size, workers=1, project=run_dir)

        val_metadata = json.loads(open(os.path.join(val_data_path, "metadata.json")).read())
        all_class_instances = []
        all_class_images = []
        for annotation_file in tqdm(os.listdir(os.path.join(val_data_path, "annotations"))):
            annotations = json.loads(open(os.path.join(val_data_path, "annotations", annotation_file)).read())
            all_class_instances += annotations["class_ids"]
            all_class_images += list(set(annotations["class_ids"]))

        class_ids, image_counts = np.unique(all_class_images, return_counts=True)
        image_count_dict = {}
        for class_id, image_count in zip(class_ids, image_counts):
            image_count_dict[val_metadata["classes"][class_id]] = image_count

        class_ids, ins_counts = np.unique(all_class_instances, return_counts=True)
        ins_count_dict = {}
        for class_id, ins_count in zip(class_ids, ins_counts):
            ins_count_dict[val_metadata["classes"][class_id]] = ins_count
            
        class_list = [str(results.names[i]) for i in range(len(results.names))]
        class_report = {
            "Classes" : class_list.copy(),
            "number_images" : [int(image_count_dict[x]) for x in class_list],
            "number_instances" : [int(ins_count_dict[x]) for x in class_list],
            "Precision" : np.round(results.box.p, 3).tolist(),
            "Recall" : np.round(results.box.r, 3).tolist(),
            "MAP" : np.round(results.box.ap50, 3).tolist(),
        }

        class_report["Classes"] += ["Average"]
        class_report["number_images"] += [int(np.sum([image_count_dict[x] for x in class_list]))]
        class_report["number_instances"] += [int(np.sum([ins_count_dict[x] for x in class_list]))]
        class_report["Precision"] += [round(float(results.box.mp), 3)]
        class_report["Recall"] += [round(float(results.box.mr), 3)]
        class_report["MAP"] += [round(float(results.box.map50), 3)]
        
        update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
        mongodb['training_history'].update_many(update_query, {'$set' : {"classification_report" : class_report}})

        
        update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
        mongodb['run_records'].update_many(update_query, {'$set' : {"training_status" : "completed!", "class_list" : train_metadata['classes']}})





def InstanceSegmentationEvaluationPipeline(
        eval_run_name,
        val_data_name,
        project_name,
        project_type,
        user_id,
        run_record,
        val_batch_size,
        device,
        val_dataset_path        
        ):
    
    from ultralytics import  YOLO 
    
    train_run_name = run_record['run_name']
    model_name = run_record['model_name']
    model_arch = run_record['model_arch']
    model_family = run_record['model_family']
    model_path = run_record['model_path']
    class_list = run_record['class_list']
    num_classes = len(class_list)
    
    metadata = json.loads(open(os.path.join(val_dataset_path, 'metadata.json')).read())
    
    if class_list != metadata["classes"]:
        raise ValueError(f"Class list in {val_dataset_path} does not match the class list in metadata.json!")
    
    if model_family.startswith('YOLO'):
        pass
    
    
    val_metadata = json.loads(open(os.path.join(val_dataset_path, "metadata.json")).read())
    
    project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
    run_dir = os.path.join(project_info["project_dir"], "RUN_EVAL_" + eval_run_name + f"_{uuid.uuid4().__str__()}")
    os.makedirs(run_dir, exist_ok=True)
    
    data_dir = os.path.join(run_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    
        
    if model_family.lower().startswith("yolo"):

        import yaml
        
        os.makedirs(os.path.join(data_dir, 'images/val'), exist_ok=True)
        os.makedirs(os.path.join(data_dir, 'labels/val'), exist_ok=True)
        
        
        
        val_samples = os.listdir(os.path.join(val_dataset_path, "images"))
        for sample in tqdm(val_samples, desc="val samples"):
            image_path = os.path.join(val_dataset_path, "images", sample)
            annotation_path = os.path.join(val_dataset_path, "annotations", sample[:-4] + ".json") # work for .jpg and .png
            base_name = os.path.basename(image_path)
        
            shutil.copy(image_path, os.path.join(data_dir, "images", "val"))
            
            with open(annotation_path) as f:
                data = json.load(f)
                segments = data['segments']
                image_size = data['size']
                yolo_segments = []
                for segment in segments:
                    segment_norm = []
                    for idx, val in enumerate(segment):
                        if idx % 2 == 0:
                            val = val / image_size[1]
                        else:
                            val = val / image_size[0]
                        segment_norm.append(val)
                    yolo_segments.append(segment_norm[:-2])
                class_ids = data['class_ids']
        
                label_file = open(os.path.join(data_dir, "labels", "val", f"{base_name[:-4]}.txt"), 'w')
                for class_id, segment in zip(class_ids, yolo_segments):
                    label_file.write(f"{class_id} {' '.join(map(str, segment))}\n")
                label_file.close()
        
        
        # Create dataset.yaml
        dataset_yaml = {
            'train': os.path.join('images', 'train'),
            'val': os.path.join('images', 'val'),
            'nc': len(val_metadata['classes']),
            'names': val_metadata['classes']
        }

        data_config_path = os.path.join(data_dir, 'dataset.yaml')
        with open(data_config_path, 'w') as f:
            yaml.dump(dataset_yaml, f)
        
        print("Dataset conversion complete.")
        
        
        model = YOLO(model_path)
        model = model.to(device)
        
        results = model.val(data=os.path.abspath(data_config_path), batch=val_batch_size, workers=1, project=run_dir)

        val_metadata = json.loads(open(os.path.join(val_dataset_path, "metadata.json")).read())
        all_class_instances = []
        all_class_images = []
        for annotation_file in tqdm(os.listdir(os.path.join(val_dataset_path, "annotations"))):
            annotations = json.loads(open(os.path.join(val_dataset_path, "annotations", annotation_file)).read())
            all_class_instances += annotations["class_ids"]
            all_class_images += list(set(annotations["class_ids"]))

        class_ids, image_counts = np.unique(all_class_images, return_counts=True)
        image_count_dict = {}
        for class_id, image_count in zip(class_ids, image_counts):
            image_count_dict[val_metadata["classes"][class_id]] = image_count

        class_ids, ins_counts = np.unique(all_class_instances, return_counts=True)
        ins_count_dict = {}
        for class_id, ins_count in zip(class_ids, ins_counts):
            ins_count_dict[val_metadata["classes"][class_id]] = ins_count
            
        class_list = [str(results.names[i]) for i in range(len(results.names))]
        class_report = {
            "Classes" : class_list.copy(),
            "number_images" : [int(image_count_dict[x]) for x in class_list],
            "number_instances" : [int(ins_count_dict[x]) for x in class_list],
            "Precision" : np.round(results.box.p, 3).tolist(),
            "Recall" : np.round(results.box.r, 3).tolist(),
            "MAP" : np.round(results.box.ap50, 3).tolist(),
        }

        class_report["Classes"] += ["Average"]
        class_report["number_images"] += [int(np.sum([image_count_dict[x] for x in class_list]))]
        class_report["number_instances"] += [int(np.sum([ins_count_dict[x] for x in class_list]))]
        class_report["Precision"] += [round(float(results.box.mp), 3)]
        class_report["Recall"] += [round(float(results.box.mr), 3)]
        class_report["MAP"] += [round(float(results.box.map50), 3)]
        
        
    
    eval_run_time = datetime.now()
    eval_run_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    evaluation_data = {
        "_id" : user_id + "-" + project_name + "_" + eval_run_name,
        "eval_run_name" : eval_run_name,
        "train_run_name" : train_run_name,
        "eval_data_name" : val_data_name,
        "project_name" : project_name,
        "project_type" : project_type,
        "user_id" : user_id,
        "eval_run_time" : eval_run_time,
        "eval_run_time_str" : eval_run_time_str,
        "class_report" : class_report
    }
    
    mongodb['evaluation_history'].insert_one(evaluation_data)
    