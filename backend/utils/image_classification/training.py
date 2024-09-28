
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

    # If training mode is 'transfer', freeze all layers except the final layer
    if train_mode == 'transfer':
        for param in model.parameters():
            param.requires_grad = False
        if hasattr(model, 'fc'):
            model.fc.requires_grad = True
        elif hasattr(model, 'classifier'):
            model.classifier[-1].requires_grad = True

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


def prepare_dataset(dataset_path, trainval_ratio=0.8, batch_size=32, num_workers=4, 
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


    
    # Define transformations for the dataset
    transform = transforms.Compose([
        transforms.Resize(input_size),  # Resize images to the expected input size for the model
        transforms.ToTensor(),          # Convert images to PyTorch tensors
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize based on ImageNet mean/std
    ])
    
    if split_dataset:
        # Case 1: Dataset is already split into 'train' and 'val' directories
        train_dir = os.path.join(dataset_path, 'train')
        val_dir = os.path.join(dataset_path, 'val')
        
        # Load the datasets
        train_dataset = datasets.ImageFolder(train_dir, transform=transform)
        val_dataset = datasets.ImageFolder(val_dir, transform=transform)
    else:
        # Case 2: Non-split dataset, we'll split it into train and val sets
        dataset = datasets.ImageFolder(dataset_path, transform=transform)
        train_size = int(trainval_ratio * len(dataset))
        val_size = len(dataset) - train_size
        
        # Randomly split the dataset
        train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    
    # Create DataLoaders for training and validation
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
    
    # Directly access the classes attribute
    if split_dataset:
        num_classes = len(train_dataset.classes)
        classnames = train_dataset.classes
    else:
        num_classes = len(dataset.classes)
        classnames = dataset.classes
    
    print(f"Number of classes: {num_classes}")
    
    return train_loader, val_loader, num_classes, classnames




def train_model(run_name, data_name, project_name, user_id, model, train_loader, val_loader, num_classes, classnames, device='cuda', num_epochs=10, learning_rate=0.001):
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

    mongodb["training_history"].insert_one({"run_name" : run_name, "data_name" : data_name, "project_name" : project_name, "user_id" : user_id, "history" : history, "classification_report" : "Will available after training!"})
    
    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        history['epochs'].append(f'{epoch+1}/{num_epochs}')
        
        update_query = {"run_name" : run_name, "data_name" : data_name, "project_name" : project_name, "user_id" : user_id}
        mongodb['run_records'].update_many(update_query, {'$set' : {"training_status" : f'Epoch {epoch+1}/{num_epochs}'}})

        print('-' * 10)
        
        # Training phase
        model.train()  # Set the model to training mode
        running_loss = 0.0
        correct_preds = 0
        total_samples = 0
        
        # Iterate over data
        for inputs, labels in tqdm(train_loader, desc='Training'):
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
            loss.requires_grad = True
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

        
        update_query = {"run_name" : run_name, "data_name" : data_name, "project_name" : project_name, "user_id" : user_id}
        mongodb['training_history'].update_many(update_query, {'$set' : {"history" : history}})

    
    # Load the best model weights
    if best_model_wts is not None:
        model.load_state_dict(best_model_wts)
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
    class_report = classification_report(all_labels, all_preds, target_names=classnames, zero_division=0)
    
    print('Classification Report:\n', class_report)
    
    update_query = {"run_name" : run_name, "data_name" : data_name, "project_name" : project_name, "user_id" : user_id}
    mongodb['training_history'].update_many(update_query, {'$set' : {"history" : history, "classification_report" : class_report}})

    
    return model, history, class_report



def ImageClassificationTrainingPipeline(
        run_name,
        data_name,
        project_name,
        user_id,
        arch_name,
        training_mode,
        batch_size,
        num_epochs,
        learning_rate,
        device,
        dataset_path,
        ):
    


    input_size = input_sizes.get(arch_name, (224, 224))  # Default to (224, 224) if not found

    # If using a split dataset
    train_loader, val_loader, num_classes, classnames = prepare_dataset(
        dataset_path=dataset_path,
        split_dataset=True,    # Set to True if the dataset has 'train' and 'val' directories
        batch_size=batch_size,         # Batch size
        input_size=input_size,  # Example input size for ResNet models
        num_workers=2,           # Number of worker threads
    )

    if training_mode == "scratch":
        model = get_model(arch_name=arch_name, num_classes=num_classes, 
                        pretrained=False, train_mode='transfer')
    elif training_mode == "finetune":
        model = get_model(arch_name=arch_name, num_classes=num_classes, 
                        pretrained=True, train_mode='finetune')
    elif training_mode == "transfer":
        model = get_model(arch_name=arch_name, num_classes=num_classes, 
                        pretrained=True, train_mode='transfer')
        
    model = model.to(device)

    # model_summary(model, input_size=tuple([3] + list(input_size)), batch_size=batch_size, device=device)

    print(f"Number of Classes : {num_classes}")
    print(f"Classes : {classnames}")


    # Assuming train_loader, val_loader, and model are already prepared
    trained_model, history, class_report = train_model(
        run_name=run_name,
        data_name=data_name,
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



    
    update_query = {"run_name" : run_name, "data_name" : data_name, "project_name" : project_name, "user_id" : user_id}
    mongodb['run_records'].update_many(update_query, {'$set' : {"training_status" : "Completed"}})

    return trained_model, history, class_report