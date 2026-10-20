interface EmailInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface PasswordInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLogin?: boolean;
  showError?: boolean;
}

interface SignupContextType {
  step: number;
  setStep: (step: number) => void;
  formData: { email?: string; password?: string };
  setFormData: (data: { email?: string; password?: string }) => void;
}
interface ResetContextType {
  step: number;
  setStep: (step: number) => void;
  formData: { email: string; password: string; otp: string };
  setFormData: Dispatch<
    SetStateAction<{ email: string; password: string; otp: string }>
  >;
}

interface VerifyEmailProps {
  searchParams: { email: string | undefined };
}

interface PageProps {
  searchParams: {
    [key: string]: string | string | undefined;
  };
}
interface IconProps {
  color?: string;
  width?: number;
  height?: number;
}

interface OverviewHeatmapCardProps {
  img?: string;
  title?: string;
  date?: string;
}

interface SettingsProps {
  color?: string;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface PlanCardProps {
  price: string;
  features: string[];
  className?: string;
  showBlueBg?: boolean;
  planName?: string;
  onClickButton?: () => void;
  Icon: string;
  key: string | number;
  index: string | number;
}
