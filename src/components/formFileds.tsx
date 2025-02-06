import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormFieldComponentProps<T> = {
  control: any;
  name: keyof T;
  label: string;
  placeholder: string;
  type?: string;
  component?: React.ElementType;
};
export default function FormFieldComponent<T>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  component: Component = Input,
}: FormFieldComponentProps<T>) {
  return (
    <FormField
      control={control}
      name={name  as keyof T as string}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Component {...field} type={type} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
