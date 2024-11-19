import os
import random, uuid
from glob import glob
import cv2
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
from tqdm import tqdm


class ObjectDetectionAugmentor:
    def __init__(self, dataset_root, new_dataset_path, augmentations, target_classes=None, n_augments=None, aug_configs=None):
        """
        :param dataset_root: Root path of the dataset (organized in class folders).
        :param new_dataset_path: Path to save the augmented dataset.
        :param augmentations: List of augmentations to apply.
        :param target_classes: List of target classes to augment (None means all classes).
        :param n_augments: List specifying the number of augmented images for each class.
        :param aug_configs: Dictionary containing configurations for augmentations.
        """
        self.dataset_root = dataset_root
        self.new_dataset_path = new_dataset_path
        self.augmentations = augmentations
        self.target_classes = target_classes
        self.n_augments = n_augments
        self.aug_configs = aug_configs or {}
        self.class_list = json.loads(open(os.path.join(self.dataset_root, "metadata.json")).read())["classes"]

        # os.makedirs(new_dataset_path, exist_ok=True)
        self.new_images_path = os.path.join(self.new_dataset_path, "images")
        self.new_annotations_path = os.path.join(self.new_dataset_path, "annotations")
        os.makedirs(self.new_images_path, exist_ok=True)
        os.makedirs(self.new_annotations_path, exist_ok=True)

    

    def get_augmentation_pipeline(self):
        """
        Create an Albumentations pipeline based on user-selected augmentations and configurations.
        """
        pipeline = []

        # Horizontal Flip
        if 'flip' in self.augmentations:
            pipeline.append(A.HorizontalFlip(p=self.aug_configs.get('flip_prob', 0.5)))

        # Rotation
        if 'rotate' in self.augmentations:
            pipeline.append(A.Rotate(limit=self.aug_configs.get('rotate_limit', 30), p=self.aug_configs.get('rotate_prob', 0.5)))

        # Shift, Scale, Rotate
        if 'shift_scale_rotate' in self.augmentations:
            pipeline.append(A.ShiftScaleRotate(shift_limit=self.aug_configs.get('shift_limit', 0.1),
                                               scale_limit=self.aug_configs.get('scale_limit', 0.1),
                                               rotate_limit=self.aug_configs.get('rotate_limit', 30),
                                               p=self.aug_configs.get('shift_scale_rotate_prob', 0.5)))

        # Brightness & Contrast Adjustment
        if 'brightness' in self.augmentations:
            pipeline.append(A.RandomBrightnessContrast(brightness_limit=self.aug_configs.get('brightness_limit', 0.2),
                                                       contrast_limit=self.aug_configs.get('contrast_limit', 0.2),
                                                       p=self.aug_configs.get('brightness_prob', 0.5)))

        # HSV Adjustment
        if 'hsv' in self.augmentations:
            pipeline.append(A.HueSaturationValue(hue_shift_limit=self.aug_configs.get('hue_limit', 20),
                                                 sat_shift_limit=self.aug_configs.get('sat_limit', 30),
                                                 val_shift_limit=self.aug_configs.get('val_limit', 20),
                                                 p=self.aug_configs.get('hsv_prob', 0.5)))

        # Gaussian Noise
        if 'noise' in self.augmentations:
            pipeline.append(A.GaussNoise(p=self.aug_configs.get('noise_prob', 0.5)))

        # Gaussian Blur
        if 'blur' in self.augmentations:
            pipeline.append(A.Blur(blur_limit=self.aug_configs.get('blur_limit', 3), p=self.aug_configs.get('blur_prob', 0.3)))

        # Motion Blur
        if 'motion_blur' in self.augmentations:
            pipeline.append(A.MotionBlur(blur_limit=self.aug_configs.get('motion_blur_limit', 3), p=self.aug_configs.get('motion_blur_prob', 0.3)))

        # Elastic Transform
        if 'elastic_transform' in self.augmentations:
            pipeline.append(A.ElasticTransform(alpha=self.aug_configs.get('elastic_alpha', 1),
                                               sigma=self.aug_configs.get('elastic_sigma', 50),
                                               alpha_affine=self.aug_configs.get('elastic_alpha_affine', 50),
                                               p=self.aug_configs.get('elastic_prob', 0.5)))

        # Grid Distortion
        if 'grid_distortion' in self.augmentations:
            pipeline.append(A.GridDistortion(p=self.aug_configs.get('grid_prob', 0.5)))

        # Cutout
        if 'cutout' in self.augmentations:
            # pipeline.append(A.Cutout(num_holes=self.aug_configs.get('cutout_num_holes', 8),
            #                          max_h_size=self.aug_configs.get('cutout_max_h', 16),
            #                          max_w_size=self.aug_configs.get('cutout_max_w', 16),
            #                          p=self.aug_configs.get('cutout_prob', 0.5)))
            pipeline.append(A.CoarseDropout(max_holes=self.aug_configs.get('cutout_num_holes', 8),
                            max_height=self.aug_configs.get('cutout_max_height', 16),
                            max_width=self.aug_configs.get('cutout_max_width', 16),
                            min_height=self.aug_configs.get('cutout_min_height', 8),
                            min_width=self.aug_configs.get('cutout_min_width', 8),
                            p=self.aug_configs.get('cutout_prob', 0.5)))


        # CLAHE
        if 'clahe' in self.augmentations:
            pipeline.append(A.CLAHE(clip_limit=self.aug_configs.get('clahe_clip_limit', 2.0),
                                    p=self.aug_configs.get('clahe_prob', 0.5)))

        # Grayscale
        if 'grayscale' in self.augmentations:
            pipeline.append(A.ToGray(p=self.aug_configs.get('grayscale_prob', 0.5)))

        # Channel Shuffle
        if 'channel_shuffle' in self.augmentations:
            pipeline.append(A.ChannelShuffle(p=self.aug_configs.get('channel_shuffle_prob', 0.5)))

        # Sharpening
        if 'sharpen' in self.augmentations:
            pipeline.append(A.Sharpen(alpha=self.aug_configs.get('sharpen_alpha', 0.2),
                                      lightness=self.aug_configs.get('sharpen_lightness', 0.5),
                                      p=self.aug_configs.get('sharpen_prob', 0.5)))

        # Random Crop
        if 'random_crop' in self.augmentations:
            pipeline.append(A.RandomCrop(height=self.aug_configs.get('random_crop_height', 224),
                                         width=self.aug_configs.get('random_crop_width', 224),
                                         p=self.aug_configs.get('random_crop_prob', 0.5)))
    
        # Center Crop
        if 'center_crop' in self.augmentations:
            pipeline.append(A.CenterCrop(height=self.aug_configs.get('center_crop_height', 224),
                                         width=self.aug_configs.get('center_crop_width', 224),
                                         p=self.aug_configs.get('center_crop_prob', 0.5)))
    
        # Random Resized Crop
        if 'resized_crop' in self.augmentations:
            pipeline.append(A.RandomResizedCrop(height=self.aug_configs.get('resized_crop_height', 224),
                                                width=self.aug_configs.get('resized_crop_width', 224),
                                                scale=(self.aug_configs.get('resized_scale_min', 0.8),
                                                       self.aug_configs.get('resized_scale_max', 1.0)),
                                                p=self.aug_configs.get('resized_crop_prob', 0.5)))


        
        # Convert to Tensor
        # pipeline.append(ToTensorV2())

        return A.Compose(pipeline, bbox_params=A.BboxParams(format='pascal_voc', label_fields=['class_labels']))

    
    
    def augment_images(self):

        augment_pipeline = self.get_augmentation_pipeline()
        image_dir = os.path.join(self.dataset_root, "images")
        ann_dir = os.path.join(self.dataset_root, "annotations")
        img_list = os.listdir(image_dir)
        if isinstance(self.target_classes, list):
            classwise_samples = {class_name:[] for class_name in self.target_classes}
            for img_file_name in img_list:
                ann_file_name = ".".join(img_file_name.split(".")[:-1])+".json"
                ann_path = os.path.join(ann_dir, ann_file_name)
                ann_json = json.loads(open(ann_path).read())
                ann_classes = [self.class_list[class_id] for class_id in ann_json["class_ids"]]
                for target_class in self.target_classes:
                    if target_class in ann_classes:
                        classwise_samples[target_class].append(img_file_name)
            self.classwise_samples = classwise_samples
        else:
            self.classwise_samples = img_list

        if isinstance(self.target_classes, list):
            for class_name in self.target_classes:
                n_augment = int(self.n_augments.get(class_name, 0))
                available_samples = self.classwise_samples[class_name]
                # print(f"available_samples : {available_samples}")
                # Step 1: Check if num_augments is less than or equal to the number of available images
                if n_augment <= len(available_samples):
                    # Sample without replacement if num_augments is less than or equal to the number of images
                    selected_images = random.sample(available_samples, n_augment)
                else:
                    # Sample all images once and then with replacement to reach the required count
                    selected_images = available_samples + random.choices(available_samples, k=n_augment - len(available_samples))

                # print(f"selected_images : {selected_images}")
                for image_file_name in selected_images:
                    image_path = os.path.join(image_dir, image_file_name)
                    ann_path = os.path.join(ann_dir, ".".join(image_file_name.split(".")[:-1])+".json")
                    
                    img = cv2.imread(image_path)
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    ann_dict = json.loads(open(ann_path).read())
                    
                    bboxes = ann_dict['bboxes']
                    class_ids = ann_dict['class_ids']
                    
                    # Apply augmentation
                    augmented = augment_pipeline(image=img, bboxes=bboxes, class_labels=class_ids)
                    aug_img = augmented['image']
                    aug_bboxes = augmented['bboxes']
                    aug_bboxes = np.array(aug_bboxes).astype(int).tolist()
                    aug_class_ids = augmented['class_labels']
                    aug_class_ids =  np.array(aug_class_ids).astype(int).tolist()

                    aug_ann_dict = {"bboxes" : aug_bboxes, "class_ids" : aug_class_ids, "size" : ann_dict['size']}

                    aug_uuid = uuid.uuid4().__str__()[:8]
    
                    # Save the augmented image
                    aug_img_path = os.path.join(
                        self.new_images_path,
                        f"{'.'.join(image_file_name.split('.')[:-1])}_aug_{aug_uuid}.jpg"
                    )
    
                    cv2.imwrite(aug_img_path, aug_img)

                    aug_ann_path = os.path.join(self.new_annotations_path, 
                                                f"{'.'.join(image_file_name.split('.')[:-1])}_aug_{aug_uuid}.json")

                    with open(aug_ann_path, "w") as f:
                        f.writelines(json.dumps(aug_ann_dict))
                    
                    
                    
