import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { LogbookEntry, LogbookImage } from '@/types/logbook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogbookEntryForm } from './logbook-entry-form';
import { Camera, Edit, Image, Trash2, X } from 'lucide-react';
import { formatDate } from '@/utils/format';

interface LogbookEntryCardProps {
  entry: LogbookEntry;
  onUpdate: (updates: Partial<LogbookEntry>) => void;
  onDelete: () => void;
  onAddImage: (image: Omit<LogbookImage, 'id' | 'timestamp'>) => void;
  onDeleteImage: (imageId: string) => void;
}

export function LogbookEntryCard({
  entry,
  onUpdate,
  onDelete,
  onAddImage,
  onDeleteImage,
}: LogbookEntryCardProps) {
  const { settings } = useSettings();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const diameter = entry.diameterId
    ? settings.diameters.find((d) => d.id === entry.diameterId)
    : null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddImage({
          url: reader.result as string,
          type: 'upload'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for video metadata to load
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      ctx.drawImage(video, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());
      
      onAddImage({
        url: imageUrl,
        type: 'camera'
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(
        error instanceof Error 
          ? error.message 
          : 'Could not access camera. Please check permissions and try again.'
      );
    }
  };

  // Ensure entry.images exists with a default empty array
  const images = entry.images || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>{entry.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDate(entry.timestamp)}</span>
            {diameter && (
              <>
                <span>•</span>
                <span>{diameter.diameter}mm</span>
              </>
            )}
            {entry.speed && (
              <>
                <span>•</span>
                <span>{entry.speed} RPM</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <LogbookEntryForm
            onSubmit={(updates) => onUpdate(updates)}
            initialValues={entry}
          >
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </LogbookEntryForm>
          <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <p>{entry.content}</p>
        </div>

        {/* Tags and Category */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
          </Badge>
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-video rounded-lg border bg-muted"
              >
                <img
                  src={image.url}
                  alt=""
                  className="absolute inset-0 h-full w-full rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => onDeleteImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Camera Error Message */}
        {cameraError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {cameraError}
          </div>
        )}

        {/* Image Upload Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImageUpload(!showImageUpload)}
          >
            <Image className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          <Button
            variant="outline"
            onClick={handleCameraCapture}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
        </div>

        {showImageUpload && (
          <div className="rounded-lg border border-dashed p-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}