import { useRef, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the selected file."));
    };

    reader.onerror = () => reject(reader.error ?? new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });

type AssetUploadButtonProps = {
  accept?: string;
  label: string;
  onValueChange: (nextValue: string) => void;
};

const AssetUploadButton = ({ accept, label, onValueChange }: AssetUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onValueChange(dataUrl);
      toast.success(`${file.name} uploaded.`);
    } catch (error) {
      console.error("Unable to upload the selected file.", error);
      toast.error("Unable to upload the selected file.");
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
      >
        <Upload size={14} />
        {label}
      </Button>
    </>
  );
};

export default AssetUploadButton;
