
from initials import *
from torch.utils.data import Dataset, DataLoader


class SegmentationDataset(Dataset):
    def __init__(self, images_dir, annotations_dir, transform=None):
        self.images_dir = images_dir
        self.annotations_dir = annotations_dir
        self.transform = transform
        
        self.image_filenames = [f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.png'))]
        
        with open(os.path.join(images_dir, '../metadata.json'), 'r') as f:
            self.metadata = json.load(f)
        self.classes = self.metadata["classes"]
        
    def __len__(self):
        return len(self.image_filenames)
    
    def __getitem__(self, idx):
        # Load the image
        image_path = os.path.join(self.images_dir, self.image_filenames[idx])
        image = Image.open(image_path).convert('RGB')  # Convert image to RGB

        # Load the segmentation map (npy)
        mask_filename = os.path.splitext(self.image_filenames[idx])[0] + '.npy'
        mask_path = os.path.join(self.annotations_dir, mask_filename)
        mask = np.load(mask_path)
        
        # Handle the transformation (if any)
        if self.transform:
            augmented = self.transform(image=np.array(image), mask=mask)
            image = augmented['image']
            mask = augmented['mask']

        # No need to manually transpose the image here
        # Convert directly to tensor (ToTensorV2 already handles this)
        image = image.float()#astype(np.float32)  # Ensure float32
        mask = torch.as_tensor(mask, dtype=torch.long).clone().detach()   # Segmentation map as long tensor

        return image, mask
    
    

def validate_model(model, dataloader, loss_fn, device, classnames):
    num_classes = len(classnames)
    model.eval()  # Set model to evaluation mode
    val_loss = 0.0
    iou_metric_val = 0.0
    iou_per_class = torch.zeros(num_classes).to(device)  # To store IoU for each class

    total_tp = 0
    n_pixels = 0
    n_samples = 0
    classwise_pixels = {class_name: {"TP": 0, "FP": 0, "FN": 0, "precision" : 0, "recall" : 0, "IoU" : 0} for class_name in classnames}

    avg_val_loss = 0
    with torch.no_grad():  # Disable gradient computation for validation
        for images, masks in tqdm(dataloader):
            n_samples += images.shape[0]
            images = images.to(device)
            masks = masks.to(device)

            # Forward pass
            outputs = model(images)
            
            if loss_fn is not None:
                loss = loss_fn(outputs, masks)
                val_loss += loss.item()

            # Compute IoU for each class
            
            if num_classes > 2:
                preds = torch.argmax(outputs, dim=1)
            else:
                preds = torch.sigmoid(outputs) > 0.5


            total_tp += int(torch.sum(preds == masks))
            n_pixels += masks.shape[0] * masks.shape[1] * masks.shape[2]

            for class_name in classnames:
                c = classnames.index(class_name)
                # For each class, calculate TP, FP, FN for IoU
                pred_c = (preds == c)
                mask_c = (masks == c)

                TP = torch.sum(pred_c & mask_c).item()
                FP = torch.sum(pred_c & ~mask_c).item()
                FN = torch.sum(~pred_c & mask_c).item()

                classwise_pixels[class_name]["TP"] += TP
                classwise_pixels[class_name]["FP"] += FP
                classwise_pixels[class_name]["FN"] += FN

    if loss_fn is not None:
        avg_val_loss = val_loss / len(dataloader)

    # Print detailed evaluation report
    for class_name in classnames:
        tp = classwise_pixels[class_name]["TP"]
        fp = classwise_pixels[class_name]["FP"]
        fn = classwise_pixels[class_name]["FN"]

        precision = tp / (tp + fp + 1e-6)
        recall = tp / (tp + fn + 1e-6)
        iou = tp / (tp + fp + fn + 1e-6)

        classwise_pixels[class_name]["precision"] = precision
        classwise_pixels[class_name]["recall"] = iou
        classwise_pixels[class_name]["IoU"] = iou

        classwise_pixels[class_name]["class_name"] = class_name
        

        # print(f"Class {class_name}:")
        # print(f"  Precision: {precision:.4f}, Recall: {recall:.4f}, IoU: {iou:.4f}")
    classwise_pixels["average"] = {}
    classwise_pixels["overall"] = {}
    
    # classwise_pixels["average"]["TP"] = int(np.mean([classwise_pixels[class_name]["TP"] for class_name in classnames]))
    # classwise_pixels["average"]["FP"] = int(np.mean([classwise_pixels[class_name]["FP"] for class_name in classnames]))
    # classwise_pixels["average"]["FN"] = int(np.mean([classwise_pixels[class_name]["FN"] for class_name in classnames]))
    classwise_pixels["average"]["precision"] = round(float(np.mean([classwise_pixels[class_name]["precision"] for class_name in classnames])), 4)
    classwise_pixels["average"]["recall"] = round(float(np.mean([classwise_pixels[class_name]["recall"] for class_name in classnames])), 4)
    classwise_pixels["average"]["IoU"] = round(float(np.mean([classwise_pixels[class_name]["IoU"] for class_name in classnames])), 4)
    classwise_pixels["average"]["class_name"] = "average"
    
    # classwise_pixels["overall"]["TP"] = int(np.sum([classwise_pixels[class_name]["TP"] for class_name in classnames]))
    # classwise_pixels["overall"]["FP"] = int(np.sum([classwise_pixels[class_name]["FP"] for class_name in classnames]))
    # classwise_pixels["overall"]["FN"] = int(np.sum([classwise_pixels[class_name]["FN"] for class_name in classnames]))
    # classwise_pixels["overall"]["precison"] = round(float(tp / (tp + fp + 1e-6)), 4)
    # classwise_pixels["overall"]["recall"] = round(float(tp / (tp + fn + 1e-6)), 4)
    classwise_pixels["overall"]["IoU"] = round(float(total_tp / (n_pixels + 1e-6)), 4)
    classwise_pixels["overall"]["class_name"] = "overall"

    classwise_records = [{"class_name" : classwise_pixels[x]["class_name"], **classwise_pixels[x]} for x in classwise_pixels.keys()]
    


    return avg_val_loss, classwise_records, classwise_pixels["average"]["IoU"], classwise_pixels["overall"]["IoU"]



def SemanticSegmentationTrainingPipeline(run_name,
                                    train_data_name,
                                    val_data_name,
                                    project_name,
                                    user_id,
                                    model_arch,
                                    model_family,
                                    model_name,
                                    training_mode,
                                    batch_size,
                                    num_epochs,
                                    learning_rate,
                                    device,
                                    train_data_path,
                                    val_data_path):
    
    import os
    import numpy as np
    import torch
    from torch.utils.data import Dataset, DataLoader
    from PIL import Image
    import json
    import copy
    import segmentation_models_pytorch as smp
    import albumentations as A
    from albumentations.pytorch import ToTensorV2
    
    
    project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
    run_dir = os.path.join(project_info["project_dir"], "RUN_" + run_name + f"_{uuid.uuid4().__str__()}")
    os.makedirs(run_dir, exist_ok=True)
    
    model_path = os.path.join(run_dir, "best_model.pt")




    def train_model_with_validation(
        model, 
        train_dataloader, 
        val_dataloader, 
        optimizer, 
        loss_fn, 
        device, 
        num_epochs=10,
        classnames=None
    ):
        
        num_classes = len(classnames)
        model.to(device)
        best_model_wts = copy.deepcopy(model.state_dict())
        best_iou = 0.0
        
        history = {
                    "epochs" : [],
                    "train_loss" : [],
                    "train_iou" : [],
                    "val_loss" : [],
                    "val_iou" : [],
                    "val_class_average_iou" : []
                }
                
        mongodb["training_history"].insert_one({"run_name" : run_name, "run_dir" : run_dir,  "project_name" : project_name,  "project_type" : "Object Detection", "train_data_name" : train_data_name, "val_data_name" : val_data_name, "user_id" : user_id, "model_path" : model_path, "history" : history, "classification_report" : "Will available after training!"})
    

        all_epoch_time = []
        avg_epoch_time = 0
        for epoch in range(num_epochs):
            
            epoch_start_time = time.time()

            estimated_time = (num_epochs - epoch + 1) * avg_epoch_time
            estimated_time = f"{int(estimated_time // 60)}:{int(estimated_time % 60)} Minutes"
            training_status = f"Epoch : [{epoch+1}/{num_epochs}], Estimated Time : {estimated_time}"
                    
            update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
            mongodb['run_records'].update_many(update_query, {'$set' : {"model_path" : model_path, "training_status" : training_status}})

            print(f"Epoch {epoch + 1}/{num_epochs}")
            print("-" * 20)

            # Training phase
            epoch_loss = 0.0
            iou_metric_train = 0.0
            n_samples = 0

            total_tp = 0
            n_pixels = 0

            count = 0
            for images, masks in tqdm(train_dataloader):

                model.train()
            
                n_samples += images.shape[0]
                images = images.to(device)
                masks = masks.to(device)

                # print(f"Image shape before passing to the model: {images.shape}")

                optimizer.zero_grad()
                outputs = model(images)
                loss = loss_fn(outputs, masks)
                loss.backward()
                optimizer.step()

                epoch_loss += loss.item()

                # Compute IoU
                if num_classes > 2:
                    preds = torch.argmax(outputs, dim=1)
                else:
                    preds = torch.sigmoid(outputs) > 0.5

                total_tp += int(torch.sum(preds == masks))
                n_pixels += int(masks.shape[0] * masks.shape[1] * masks.shape[2])
                
                # print(f"masks.shape : {masks.shape}, preds.shape : {preds.shape}, preds & masks : {(preds & masks).shape}, total_tp : {total_tp}, n_pixels : {n_pixels}")
                
                # iou_metric_train += total_tp / n_pixels
                
                # iou_metric_train += iou_metric(preds, masks).item()

                # if count > 10:
                #     break

                count += 1

            avg_train_loss = epoch_loss / len(train_dataloader)
            avg_train_iou = total_tp / n_pixels
            
            print(f"Training Loss: {avg_train_loss:.4f}, Training IoU: {avg_train_iou:.4f}")

            # Validation phase
            avg_val_loss, classwise_records, average_iou, overall_iou = validate_model(model, val_dataloader, loss_fn, device, classnames)
            
            print(f"Validation Loss: {avg_val_loss:.4f}, Validation Average IoU: {average_iou:.4f}, Validation Overall IoU: {overall_iou:.4f}")
            print(f"Validation IoU per class: \n")
            print(pd.DataFrame(classwise_records).set_index("class_name"))
            
            history["epochs"].append(f"{epoch+1}/{num_epochs}")
            history["train_loss"].append(round(float(avg_train_loss), 4))
            history["train_iou"].append(round(float(avg_train_iou), 4))
            history["val_loss"].append(round(float(avg_val_loss), 4))
            history["val_iou"].append(round(float(overall_iou), 4))
            history["val_class_average_iou"].append(round(float(average_iou), 4))
            
            
            update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
            mongodb['training_history'].update_many(update_query, {'$set' : {"history" : history}})


            # Save the best model
            if average_iou > best_iou:
                best_iou = average_iou
                best_model_wts = copy.deepcopy(model.state_dict())
                
            epoch_end_time = time.time()
            
            epoch_total_time = epoch_end_time - epoch_start_time
            all_epoch_time.append(epoch_total_time)
            avg_epoch_time = np.mean(all_epoch_time)

        # Load the best model weights
        model.load_state_dict(best_model_wts)
        torch.save(best_model_wts, model_path)

        return model

        

            
    # Define transformations
    transform = A.Compose([
        A.Resize(256, 256),  # Resize to ensure height and width are divisible by 32
        # A.HorizontalFlip(p=0.5),  # Optional: Random horizontal flip for augmentation
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),  # Normalization
        ToTensorV2()  # Convert to PyTorch tensor (with correct shape)
    ])

    # Device (use GPU if available)
    device = torch.device("cuda" if torch.cuda.is_available() else "CPU")
    # device = torch.device("cpu")


    # Prepare train and validation dataloaders
    train_images_dir = os.path.join(train_data_path, 'images')
    train_annotations_dir = os.path.join(train_data_path, 'annotations')
    val_images_dir = os.path.join(val_data_path, 'images')
    val_annotations_dir = os.path.join(val_data_path, 'annotations')

    train_dataset = SegmentationDataset(train_images_dir, train_annotations_dir, transform=transform)
    train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    val_dataset = SegmentationDataset(val_images_dir, val_annotations_dir, transform=transform)
    val_dataloader = DataLoader(val_dataset, batch_size=batch_size, shuffle=True)
        
        
    num_classes = len(train_dataset.classes)
    if num_classes == 2:
        num_classes = 1
    
    model = smp.create_model(
                arch=model_arch,                     # name of the architecture, e.g. 'Unet'/ 'FPN' / etc. Case INsensitive!
                encoder_name=model_name,
                encoder_weights=None if training_mode == "scratch" else "imagenet",
                in_channels=3,
                classes=num_classes,
            )

    if len(train_dataset.classes) > 2:
        loss_fn = smp.losses.DiceLoss(mode='multiclass')#+ torch.nn.CrossEntropyLoss()
    else:
        loss_fn = smp.losses.DiceLoss(mode='binary')
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)


    # Train and validate the model
    best_model = train_model_with_validation(
        model,
        train_dataloader,
        val_dataloader,
        optimizer,
        loss_fn,
        device,
        num_epochs=num_epochs,
        classnames=train_dataset.classes
    )


    avg_val_loss, classwise_records, average_iou, overall_iou = validate_model(best_model, val_dataloader, loss_fn, device, train_dataset.classes)
    
    update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
    mongodb['training_history'].update_many(update_query, {'$set' : {"classification_report" : classwise_records}})

    
    update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
    mongodb['run_records'].update_many(update_query, {'$set' : {"training_status" : "completed!", "class_list" : train_dataset.classes}})





def SemanticSegmentationEvaluationPipeline(
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
    
    
    from torch.utils.data import Dataset, DataLoader
    from PIL import Image
    import json
    import copy
    import segmentation_models_pytorch as smp
    import albumentations as A
    from albumentations.pytorch import ToTensorV2
    
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
    
    
    # Define transformations
    transform = A.Compose([
        A.Resize(256, 256),  # Resize to ensure height and width are divisible by 32
        # A.HorizontalFlip(p=0.5),  # Optional: Random horizontal flip for augmentation
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),  # Normalization
        ToTensorV2()  # Convert to PyTorch tensor (with correct shape)
    ])

    # Device (use GPU if available)
    device = torch.device("cuda" if torch.cuda.is_available() else "CPU")
    # device = torch.device("cpu")


    # Prepare train and validation dataloaders
    val_images_dir = os.path.join(val_dataset_path, 'images')
    val_annotations_dir = os.path.join(val_dataset_path, 'annotations')


    val_dataset = SegmentationDataset(val_images_dir, val_annotations_dir, transform=transform)
    val_loader = DataLoader(val_dataset, batch_size=val_batch_size, shuffle=True)
        
        
    num_classes = len(class_list)
    if num_classes == 2:
        num_classes = 1
    
    model = smp.create_model(
                arch=model_arch,                     # name of the architecture, e.g. 'Unet'/ 'FPN' / etc. Case INsensitive!
                encoder_name=model_name,
                encoder_weights=None,
                in_channels=3,
                classes=num_classes,
            )
    
    model.load_state_dict(torch.load(model_path, weights_only=True))
    model.eval()
    
    model = model.to(device)

    
    avg_val_loss, classwise_records, average_iou, overall_iou = validate_model(model, val_loader, None, device, class_list)
    
    
    
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
        "class_report" : classwise_records
    }
    
    mongodb['evaluation_history'].insert_one(evaluation_data)
    
    


def SemanticSegmentationSingleImageInference(
        image_path,
        project_name,
        project_type,
        user_id,
        run_record,
        device,       
        ):
    
    
    train_run_name = run_record['run_name']
    model_name = run_record['model_name']
    model_family = run_record['model_family']
    model_path = run_record['model_path']
    model_arch = run_record['model_arch']
    class_list = run_record['class_list']
    num_classes = len(class_list)
    
    classwise_colors = {class_name:get_color_from_id(class_id+1, rgb=True) for class_id, class_name in enumerate(class_list)}
        
        
    import segmentation_models_pytorch as smp
    import albumentations as A
    from albumentations.pytorch import ToTensorV2
        
    num_classes = len(class_list)
    if num_classes == 2:
        num_classes = 1

    model = smp.create_model(
                arch=model_arch,                     # name of the architecture, e.g. 'Unet'/ 'FPN' / etc. Case INsensitive!
                encoder_name=model_name,
                encoder_weights=None,
                in_channels=3,
                classes=num_classes,
            )

    model.load_state_dict(torch.load(model_path, weights_only=True))
    model.eval()

    
    # Define transformations
    transform = A.Compose([
        A.Resize(256, 256),  # Resize to ensure height and width are divisible by 32
        # A.HorizontalFlip(p=0.5),  # Optional: Random horizontal flip for augmentation
        A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),  # Normalization
        ToTensorV2()  # Convert to PyTorch tensor (with correct shape)
    ])

    # Device (use GPU if available)
    device = torch.device("cuda" if torch.cuda.is_available() else "CPU")
    # device = torch.device("cpu")
    
    model = model.to(device)

    data = transform(image=np.array(Image.open(image_path)))
    result = model(data['image'].float().unsqueeze(0).to(device))
    
    segmap = torch.argmax(result[0], axis=0).cpu().detach().numpy()
    
    image = cv2.imread(image_path)

    ori_size = image.shape
    
    image = cv2.resize(image, (int(segmap.shape[1]), int(segmap.shape[0])))
        
        
    segmap_vis = np.zeros_like(image)
    for class_id, class_name in enumerate(class_list):
        color = get_color_from_id(class_id+1) 
        segmap_vis[segmap.astype(int) == class_id] = color

    alpha = 0.5
    beta = 1 - alpha
    dst = cv2.addWeighted(image, alpha, segmap_vis, beta, 0.0)
    
    output_image = cv2.resize(dst, (int(ori_size[1]), int(ori_size[0])))
    
    
    save_dir = os.path.join("workdir", user_id, project_name, "sample_visualizations", uuid.uuid4().__str__()[:8])
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, os.path.basename(image_path))
    cv2.imwrite(save_path, output_image)
    
    return save_path, classwise_colors
            