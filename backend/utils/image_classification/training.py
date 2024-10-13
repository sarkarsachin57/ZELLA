
from initials import * 




def get_model(arch_name, num_classes, pretrained=True, train_mode='finetune'):

    from torchvision import models

    # Available models in torchvision
    model_dict = {
        'resnet18': models.resnet18,
        'resnet34': models.resnet34,
        'resnet50': models.resnet50,
        'resnet101': models.resnet101,
        'resnet152': models.resnet152,
        'vgg11': models.vgg11,
        'vgg13': models.vgg13,
        'vgg16': models.vgg16,
        'vgg19': models.vgg19,
        'densenet121': models.densenet121,
        'densenet169': models.densenet169,
        'densenet201': models.densenet201,
        'mobilenet_v2': models.mobilenet_v2,
        'mobilenet_v3_large': models.mobilenet_v3_large,
        'mobilenet_v3_small': models.mobilenet_v3_small,
        'efficientnet_b0': models.efficientnet_b0,
        'efficientnet_b1': models.efficientnet_b1,
        'efficientnet_b2': models.efficientnet_b2,
        'efficientnet_b3': models.efficientnet_b3,
        'efficientnet_b4': models.efficientnet_b4,
        'efficientnet_b5': models.efficientnet_b5,
        'efficientnet_b6': models.efficientnet_b6,
        'efficientnet_b7': models.efficientnet_b7,
        'googlenet': models.googlenet,
        'shufflenet_v2_x0_5': models.shufflenet_v2_x0_5,
        'shufflenet_v2_x1_0': models.shufflenet_v2_x1_0,
        'mnasnet0_5': models.mnasnet0_5,
        'mnasnet0_75': models.mnasnet0_75,
        'mnasnet1_0': models.mnasnet1_0,
        'mnasnet1_3': models.mnasnet1_3,
        'squeezenet1_0': models.squeezenet1_0,
        'squeezenet1_1': models.squeezenet1_1,
        'alexnet': models.alexnet,
    }

    model_weights_dict = {
        'resnet18': models.ResNet18_Weights.DEFAULT,
        'resnet34': models.ResNet34_Weights.DEFAULT,
        'resnet50': models.ResNet50_Weights.DEFAULT,
        'resnet101': models.ResNet101_Weights.DEFAULT,
        'resnet152': models.ResNet152_Weights.DEFAULT,
        
        'vgg11': models.VGG11_Weights.DEFAULT,
        'vgg13': models.VGG13_Weights.DEFAULT,
        'vgg16': models.VGG16_Weights.DEFAULT,
        'vgg19': models.VGG19_Weights.DEFAULT,
        
        'densenet121': models.DenseNet121_Weights.DEFAULT,
        'densenet169': models.DenseNet169_Weights.DEFAULT,
        'densenet201': models.DenseNet201_Weights.DEFAULT,
        
        'mobilenet_v2': models.MobileNet_V2_Weights.DEFAULT,
        'mobilenet_v3_large': models.MobileNet_V3_Large_Weights.DEFAULT,
        'mobilenet_v3_small': models.MobileNet_V3_Small_Weights.DEFAULT,
        
        'efficientnet_b0': models.EfficientNet_B0_Weights.DEFAULT,
        'efficientnet_b1': models.EfficientNet_B1_Weights.DEFAULT,
        'efficientnet_b2': models.EfficientNet_B2_Weights.DEFAULT,
        'efficientnet_b3': models.EfficientNet_B3_Weights.DEFAULT,
        'efficientnet_b4': models.EfficientNet_B4_Weights.DEFAULT,
        'efficientnet_b5': models.EfficientNet_B5_Weights.DEFAULT,
        'efficientnet_b6': models.EfficientNet_B6_Weights.DEFAULT,
        'efficientnet_b7': models.EfficientNet_B7_Weights.DEFAULT,
        
        'googlenet': models.GoogLeNet_Weights.DEFAULT,
        
        'shufflenet_v2_x0_5': models.ShuffleNet_V2_X0_5_Weights.DEFAULT,
        'shufflenet_v2_x1_0': models.ShuffleNet_V2_X1_0_Weights.DEFAULT,
        
        'mnasnet0_5': models.MNASNet0_5_Weights.DEFAULT,
        'mnasnet0_75': models.MNASNet0_75_Weights.DEFAULT,
        'mnasnet1_0': models.MNASNet1_0_Weights.DEFAULT,
        'mnasnet1_3': models.MNASNet1_3_Weights.DEFAULT,
        
        'squeezenet1_0': models.SqueezeNet1_0_Weights.DEFAULT,
        'squeezenet1_1': models.SqueezeNet1_1_Weights.DEFAULT,
        
        'alexnet': models.AlexNet_Weights.DEFAULT,
    }

    # Check if the architecture is valid
    if arch_name not in model_dict:
        raise ValueError(f"Model {arch_name} not available. Choose from {list(model_dict.keys())}")

    # Load the model with or without pretrained weights
    if pretrained:
        model = model_dict[arch_name](weights=model_weights_dict[arch_name])
    else:
        model = model_dict[arch_name](weights=None)
        
    
    # If training mode is 'transfer', freeze all layers except the final layer
    if train_mode == 'transfer':
        for param in model.parameters():
            param.requires_grad = False
        if hasattr(model, 'fc'):
            model.fc.requires_grad = True
        elif hasattr(model, 'classifier'):
            model.classifier[-1].requires_grad = True

    if num_classes <= 2:
        num_classes = 1

    # Modify the final layer to match the number of classes
    if arch_name.startswith('resnet') or arch_name.startswith('densenet'):
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
    elif arch_name.startswith('vgg'):
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, num_classes)
    elif arch_name.startswith('mobilenet') or arch_name.startswith('shufflenet') or arch_name.startswith('mnasnet'):
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, num_classes)
    elif arch_name.startswith('efficientnet'):
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, num_classes)
    elif arch_name == 'googlenet':
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
    elif arch_name.startswith('squeezenet'):
        model.classifier[1] = nn.Conv2d(512, num_classes, kernel_size=(1, 1), stride=(1, 1))
        model.num_classes = num_classes
    elif arch_name == 'alexnet':
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, num_classes)


    return model



input_sizes = {
    'resnet18': (224, 224),
    'resnet34': (224, 224),
    'resnet50': (224, 224),
    'resnet101': (224, 224),
    'resnet152': (224, 224),
    'vgg11': (224, 224),
    'vgg13': (224, 224),
    'vgg16': (224, 224),
    'vgg19': (224, 224),
    'densenet121': (224, 224),
    'densenet169': (224, 224),
    'densenet201': (224, 224),
    'mobilenet_v2': (224, 224),
    'mobilenet_v3_large': (224, 224),
    'mobilenet_v3_small': (224, 224),
    'efficientnet_b0': (224, 224),
    'efficientnet_b1': (240, 240),
    'efficientnet_b2': (260, 260),
    'efficientnet_b3': (300, 300),
    'efficientnet_b4': (380, 380),
    'efficientnet_b5': (456, 456),
    'efficientnet_b6': (528, 528),
    'efficientnet_b7': (600, 600),
    'googlenet': (224, 224),
    'shufflenet_v2_x0_5': (224, 224),
    'shufflenet_v2_x1_0': (224, 224),
    'mnasnet0_5': (224, 224),
    'mnasnet0_75': (224, 224),
    'mnasnet1_0': (224, 224),
    'mnasnet1_3': (224, 224),
    'squeezenet1_0': (224, 224),
    'squeezenet1_1': (224, 224),
    'alexnet': (224, 224),
}


architectures = ['resnet18', 'resnet34', 'resnet50', 'resnet101', 'resnet152', # Resnets
                 'vgg11', 'vgg13', 'vgg16', 'vgg19', # Vggnets
                 'densenet121', 'densenet169', 'densenet201', # Densenets
                 'mobilenet_v2', 'mobilenet_v3_large', 'mobilenet_v3_small', # MobileNets
                 'efficientnet_b0', 'efficientnet_b1', 'efficientnet_b2', 'efficientnet_b3', # EfficientNets
                 'efficientnet_b4', 'efficientnet_b5', 'efficientnet_b6', 'efficientnet_b7', # EfficientNets
                 'shufflenet_v2_x0_5', 'shufflenet_v2_x1_0', # Shufflenets
                 'mnasnet0_5', 'mnasnet0_75', 'mnasnet1_0', 'mnasnet1_3', # Mnasnets
                 'squeezenet1_0', 'squeezenet1_1', # Squeezenets
                 'googlenet', 'alexnet', # others
                 ]


def prepare_dataset(train_dataset_path, val_dataset_path, trainval_ratio=0.8, batch_size=32, num_workers=4, 
                    split_dataset=True, input_size=(224, 224)):
    """
    Prepares a PyTorch dataset from a folder structure for image classification.
    
    Args:
    - dataset_path: Path to the dataset folder.
    - trainval_ratio: Ratio to split the dataset if not pre-split (only used if split_dataset=False).
    - batch_size: The batch size to be used for DataLoader.
    - num_workers: Number of worker threads for DataLoader.
    - split_dataset: If True, expects separate 'train' and 'val' folders.
    - input_size: Image size to resize all images for the model.
    
    Returns:
    - train_loader: DataLoader for the training set.
    - val_loader: DataLoader for the validation set.
    - num_classes: Number of classes in the dataset.
    """
    
    import torchvision.transforms as transforms
    from torchvision import datasets
    from torch.utils.data import DataLoader, Dataset, random_split

    for x in os.listdir(train_dataset_path):
        if ".ipynb_checkpoints" in x:
            shutil.rmtree(os.path.join(train_dataset_path, x))
            
    for x in os.listdir(val_dataset_path):
        if ".ipynb_checkpoints" in x:
            shutil.rmtree(os.path.join(val_dataset_path, x))
    
    # Define transformations for the dataset
    transform = transforms.Compose([
        transforms.Resize(input_size),  # Resize images to the expected input size for the model
        transforms.ToTensor(),          # Convert images to PyTorch tensors
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize based on ImageNet mean/std
    ])
    
    # Load the datasets
    train_dataset = datasets.ImageFolder(train_dataset_path, transform=transform)
    val_dataset = datasets.ImageFolder(val_dataset_path, transform=transform)
    
    # Create DataLoaders for training and validation
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    
    # Directly access the classes attribute
    num_classes = len(train_dataset.classes)
    classnames = train_dataset.classes
    
    print(f"Number of classes: {num_classes}")
    
    return train_loader, val_loader, num_classes, classnames




def train_model(run_name, train_data_name, val_data_name, project_name, user_id, model, train_loader, val_loader, num_classes, classnames, device='cuda', num_epochs=10, learning_rate=0.001):
    """
    Trains a PyTorch model using the provided train and validation dataloaders.
    
    Args:
    - model: The PyTorch model to train.
    - train_loader: DataLoader for the training set.
    - val_loader: DataLoader for the validation set.
    - num_classes: Number of classes in the dataset.
    - device: The device to train on ('cuda' or 'cpu').
    - num_epochs: Number of epochs to train.
    - learning_rate: Learning rate for the optimizer.
    
    Returns:
    - model: The trained model.
    - history: A dictionary containing the training and validation loss/accuracy for each epoch.
    - classification_report: The classification report generated on the validation set using the best model.
    """
    import torch.optim as optim
    from sklearn.metrics import classification_report
    from sklearn.metrics import confusion_matrix

    def classification_report_df(y_true, y_pred, class_names):
        # Get confusion matrix
        cm = confusion_matrix(y_true, y_pred, labels=list(range(len(class_names))))
        
        # Initialize data storage for each class
        report_data = []
        
        # Loop through each class and calculate TP, FP, FN, precision, recall, and accuracy
        for idx, class_name in enumerate(class_names):
            TP = cm[idx, idx]  # True Positives
            FP = cm[:, idx].sum() - TP  # False Positives
            FN = cm[idx, :].sum() - TP  # False Negatives
            TN = cm.sum() - (TP + FP + FN)  # True Negatives
            n_samples = TP + FN  # Number of actual samples for this class
            
            # Calculate precision, recall, and accuracy
            precision = TP / (TP + FP) if (TP + FP) > 0 else 0
            recall = TP / (TP + FN) if (TP + FN) > 0 else 0
            accuracy = TP / n_samples if n_samples > 0 else 0
            
            # Append to report data
            report_data.append({
                'class_name': class_name,
                'n_sample': n_samples,
                'TP': TP,
                'FP': FP,
                'FN': FN,
                'Precision': precision,
                'Recall': recall,
                'Accuracy': accuracy
            })
        
        # Create a DataFrame from the report data
        df = pd.DataFrame(report_data).round(2)
        
        # Calculate the weighted average (overall) accuracy
        overall_accuracy = round((df['TP'].sum() / df['n_sample'].sum()), 2)
        
        # Calculate class average for precision, recall, accuracy
        class_avg_precision = round(df['Precision'].mean(), 2)
        class_avg_recall = round(df['Recall'].mean(), 2)
        class_avg_accuracy = round(df['Accuracy'].mean(), 2)


        total_samples = df["n_sample"].sum()
        avg_samples = round(df["n_sample"].mean(), 2)
        
        # Add Class Average and Overall rows
        df.loc[len(df)] = ['Class Average', avg_samples, 'NA', 'NA', 'NA', class_avg_precision, class_avg_recall, class_avg_accuracy]
        df.loc[len(df)] = ['Overall', total_samples, 'NA', 'NA', 'NA', 'NA', 'NA', overall_accuracy]
        
        return df
    
    
    project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
    run_dir = os.path.join(project_info["project_dir"], "RUN_" + run_name + f"_{uuid.uuid4().__str__()}")
    os.makedirs(run_dir, exist_ok=True)
    
    model_path = os.path.join(run_dir, "best_model.pt")
    

    # Move the model to the specified device
    model = model.to(device)
    
    # Detect if the task is binary classification based on num_classes
    binary_classification = (num_classes == 2)
    
    # Define loss function
    criterion = nn.BCEWithLogitsLoss() if binary_classification else nn.CrossEntropyLoss()
    
    # Define optimizer (Adam in this case)
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    
    # For tracking the best validation accuracy
    best_val_acc = 0.0
    best_model_wts = None
    
    # History to track training and validation metrics per epoch
    history = {
        'epochs' : [],
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': []
    }

    mongodb["training_history"].insert_one({"run_name" : run_name, "run_dir" : run_dir, "project_name" : project_name,  "project_type" : "Image Classification", "train_data_name" : train_data_name, "val_data_name" : val_data_name, "user_id" : user_id, "model_path" : model_path, "history" : history, "classification_report" : "Will available after training!"})
    
    estimated_time = 0
    average_epoch_time = 0
    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        history['epochs'].append(f'{epoch+1}/{num_epochs}')
        
        epoch_start_time = time.time()
        
        update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
        mongodb['run_records'].update_many(update_query, {'$set' : {"model_path" : model_path, "training_status" : f'Epoch {epoch+1}/{num_epochs}, Estimated time : {int(estimated_time//60)}:{int(estimated_time%60)} min'}})

        print('-' * 10)
        
        # Training phase
        model.train()  # Set the model to training mode
        running_loss = 0.0
        correct_preds = 0
        total_samples = 0
        
        # Iterate over data
        for inputs, labels in tqdm(train_loader, desc='Training'):
            
            iter_start_time = time.time()
            
            inputs, labels = inputs.to(device), labels.to(device)
            
            # Zero the parameter gradients
            optimizer.zero_grad()
            
            # Forward pass
            outputs = model(inputs)
            
            if binary_classification:
                labels = labels.float().unsqueeze(1)  # Make sure labels are shaped as (batch_size, 1)
            
            # Compute the loss
            loss = criterion(outputs, labels)
            
            # Backward pass and optimize
            # loss.requires_grad = True
            loss.backward()
            optimizer.step()
            
            # Accumulate loss and accuracy
            running_loss += loss.item() * inputs.size(0)
            
            if binary_classification:
                # For binary classification, apply sigmoid and threshold at 0.5 to get predictions
                preds = (torch.sigmoid(outputs) > 0.5).float()
                correct_preds += (preds == labels).sum().item()
            else:
                # For multi-class classification, use argmax to get predictions
                _, preds = torch.max(outputs, 1)
                correct_preds += (preds == labels).sum().item()
                
            total_samples += labels.size(0)
            
        
        epoch_loss = running_loss / total_samples
        epoch_acc = correct_preds / total_samples
        
        print(f'Training Loss: {epoch_loss:.4f}, Training Accuracy: {epoch_acc:.4f}')
        
        # Save the history for training
        history['train_loss'].append(epoch_loss)
        history['train_acc'].append(epoch_acc)
        
        # Validation phase
        model.eval()  # Set the model to evaluation mode
        val_loss = 0.0
        correct_preds = 0
        total_samples = 0
        
        with torch.no_grad():
            for inputs, labels in tqdm(val_loader, desc='Validating'):
                inputs, labels = inputs.to(device), labels.to(device)
                
                # Forward pass
                outputs = model(inputs)
                
                if binary_classification:
                    labels = labels.float().unsqueeze(1)
                
                # Compute the loss
                loss = criterion(outputs, labels)
                
                # Accumulate loss and accuracy
                val_loss += loss.item() * inputs.size(0)
                
                if binary_classification:
                    preds = (torch.sigmoid(outputs) > 0.5).float()
                    correct_preds += (preds == labels).sum().item()
                else:
                    _, preds = torch.max(outputs, 1)
                    correct_preds += (preds == labels).sum().item()
                
                total_samples += labels.size(0)
        
        val_loss = val_loss / total_samples
        val_acc = correct_preds / total_samples
        
        print(f'Validation Loss: {val_loss:.4f}, Validation Accuracy: {val_acc:.4f}\n')
        
        # Save the history for validation
        history['val_loss'].append(val_loss)
        history['val_acc'].append(val_acc)
        
        # Save the best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_model_wts = model.state_dict().copy()  # Save the best model weights
            
        
        epoch_end_time = time.time()
        
        epoch_total_time = epoch_end_time - epoch_start_time
        average_epoch_time = (average_epoch_time + epoch_total_time) / 2
        estimated_time = average_epoch_time * (num_epochs - epoch - 1)
    

        
        update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
        mongodb['training_history'].update_many(update_query, {'$set' : {"history" : history}})

    
    # Load the best model weights
    if best_model_wts is not None:
        model.load_state_dict(best_model_wts)
        torch.save(best_model_wts, model_path)
        print(f'Best validation accuracy: {best_val_acc:.4f}')
    
    # Final evaluation on the validation set using the best model
    print('Evaluating the best model on the validation set:')
    model.eval()
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for inputs, labels in tqdm(val_loader, desc='Final Evaluation'):
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            
            if binary_classification:
                preds = (torch.sigmoid(outputs) > 0.5).float()
            else:
                _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    # Generate the classification report using sklearn
    # class_report = classification_report(all_labels, all_preds, target_names=classnames, zero_division=0)
    class_report = classification_report_df(all_labels, all_preds, classnames)

    print('Classification Report:\n', class_report)
    
    classification_report = {}
    for col in class_report.columns:
        classification_report[col] = class_report[col].tolist()
    
    update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
    mongodb['training_history'].update_many(update_query, {'$set' : {"history" : history, "classification_report" : classification_report}})

    
    return model, history, class_report



def ImageClassificationTrainingPipeline(
        run_name,
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
        train_dataset_path,
        val_dataset_path        
        ):
    


    input_size = input_sizes.get(model_name, (224, 224))  # Default to (224, 224) if not found

    # If using a split dataset
    train_loader, val_loader, num_classes, classnames = prepare_dataset(
        train_dataset_path=train_dataset_path,
        val_dataset_path=val_dataset_path,
        split_dataset=True,    # Set to True if the dataset has 'train' and 'val' directories
        batch_size=batch_size,         # Batch size
        input_size=input_size,  # Example input size for ResNet models
        num_workers=2,           # Number of worker threads
    )

    if training_mode == "scratch":
        model = get_model(arch_name=model_name, num_classes=num_classes, 
                        pretrained=False, train_mode='scratch')
    elif training_mode == "finetune":
        model = get_model(arch_name=model_name, num_classes=num_classes, 
                        pretrained=True, train_mode='finetune')
    elif training_mode == "transfer":
        model = get_model(arch_name=model_name, num_classes=num_classes, 
                        pretrained=True, train_mode='transfer')
        
    model = model.to(device)

    # model_summary(model, input_size=tuple([3] + list(input_size)), batch_size=batch_size, device=device)

    print(f"Number of Classes : {num_classes}")
    print(f"Classes : {classnames}")


    # Assuming train_loader, val_loader, and model are already prepared
    trained_model, history, class_report = train_model(
        run_name=run_name,
        train_data_name=train_data_name,
        val_data_name=val_data_name,
        project_name=project_name,
        user_id=user_id,
        model=model, 
        train_loader=train_loader, 
        val_loader=val_loader, 
        num_classes=num_classes, 
        classnames=classnames,
        device='cuda' if torch.cuda.is_available() else 'cpu', 
        num_epochs=num_epochs, 
        learning_rate=learning_rate
    )



    
    update_query = {"run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, "project_name" : project_name, "user_id" : user_id}
    mongodb['run_records'].update_many(update_query, {'$set' : {"training_status" : "Completed"}})

    return trained_model, history, class_report