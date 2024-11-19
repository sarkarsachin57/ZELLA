import os
import random, uuid
from glob import glob
import cv2
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
from tqdm import tqdm


class ImageClassificationAugmentor:
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

        os.makedirs(new_dataset_path, exist_ok=True)
        self.class_images = self._load_images_by_class()

    def _load_images_by_class(self):
        """
        Load all images from the dataset and organize them by class.
        """
        class_images = {}
        for class_name in os.listdir(self.dataset_root):
            class_path = os.path.join(self.dataset_root, class_name)
            if os.path.isdir(class_path):
                images = glob(os.path.join(class_path, '*.jpg')) + glob(os.path.join(class_path, '*.png'))
                class_images[class_name] = images
        return class_images

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
        pipeline.append(ToTensorV2())

        return A.Compose(pipeline)
    
    def augment_images(self):
        
        augment_pipeline = self.get_augmentation_pipeline()
        
        for class_name, images in self.class_images.items():
            if self.target_classes and class_name not in self.target_classes:
                continue
    
            num_augments = self.n_augments if isinstance(self.n_augments, int) else self.n_augments.get(class_name, 0)
            num_augments = int(num_augments)
            output_class_path = os.path.join(self.new_dataset_path, class_name)
            os.makedirs(output_class_path, exist_ok=True)
    
            # Step 1: Check if num_augments is less than or equal to the number of available images
            if num_augments <= len(images):
                # Sample without replacement if num_augments is less than or equal to the number of images
                selected_images = random.sample(images, num_augments)
            else:
                # Sample all images once and then with replacement to reach the required count
                selected_images = images + random.choices(images, k=num_augments - len(images))
    
            # Step 2: Apply augmentation to each selected image
            for img_path in tqdm(selected_images, desc=f"Augmenting {class_name}"):
                img = cv2.imread(img_path)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
                # Apply augmentation
                augmented = augment_pipeline(image=img)
                aug_img = augmented['image']
                aug_img = aug_img.permute(1, 2, 0).cpu().detach().numpy()
    
                # Save the augmented image
                aug_img_path = os.path.join(
                    output_class_path,
                    f"{os.path.basename(img_path).split('.')[0]}_aug_{uuid.uuid4().__str__()[:8]}.jpg"
                )

                cv2.imwrite(aug_img_path, aug_img)
