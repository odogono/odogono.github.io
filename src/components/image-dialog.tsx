import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type ImageDialogProps = {
  alt: string;
  children: React.ReactNode;
  src: string;
};

const ImageDialog = ({ alt, children, src }: ImageDialogProps) => (
  <Dialog>
    <DialogTrigger className="cursor-pointer border-0 bg-transparent p-0">
      {children}
    </DialogTrigger>
    <DialogContent className="!max-w-fit p-1">
      <div className="flex items-center justify-center p-0">
        <img
          alt={alt}
          className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
          src={src}
        />
      </div>
    </DialogContent>
  </Dialog>
);

export { ImageDialog };
