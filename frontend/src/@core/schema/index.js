import { object, string, boolean} from 'zod'

export const loginSchema = object({
    email: string()
      .min(1, 'Email address is required')
      .email('Email Address is invalid'),
    password: string()
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    remember_me: boolean()
});


export const registerSchema = object({
    name: string()
      .min(1, 'Username is required'),
    email: string()
      .min(1, 'Email address is required')
      .email('Email Address is invalid'),
    password: string()
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string()
      .min(1, 'Please confirm your password')
}).refine((data) => data.password == data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords don\'t match'
});

export const profileSchema = object({
  name: string()
    .min(1, "Username is required"),
  email: string()
    .min(1, "Email is required")
    .email("Email Address is invalid"),
  address: string()
})

export const passwordSchema = object({
  currentPassword: string()
    .min(1, 'CurrentPassword is required')
    .min(8, 'CurrentPassword must be more than 8 characters')
    .max(32, 'CurrentPassword must be less than 32 characters'),
  newPassword: string()
    .min(1, 'NewPassword is required')
    .min(8, 'NewPassword must be more than 8 characters')
    .max(32, 'NewPassword must be less than 32 characters'),
  confirmNewPassword: string().min(1, 'Please confirm your password')
}).refine(data => data.newPassword == data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: "Passwords don't match"
})
export const connectSchema = object({
  url: string()
    .min(1, 'Url is required'),
  cameraName: string()
    .min(1, 'Camera Name is required')
})



