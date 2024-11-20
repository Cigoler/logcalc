import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DiameterFormProps {
  onSubmit: (diameter: number, constant: number) => void;
  initialValues?: { diameter: number; constant: number };
  buttonText?: string;
}

export function DiameterForm({ onSubmit, initialValues, buttonText = 'Add New' }: DiameterFormProps) {
  const [open, setOpen] = useState(false);
  const [diameter, setDiameter] = useState(initialValues?.diameter?.toString() || '');
  const [constant, setConstant] = useState(initialValues?.constant?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(diameter), Number(constant));
    setOpen(false);
    if (!initialValues) {
      setDiameter('');
      setConstant('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialValues ? "outline" : "default"}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Diameter' : 'Add New Diameter'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diameter">Diameter (mm)</Label>
            <Input
              id="diameter"
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="constant">Constant</Label>
            <Input
              id="constant"
              type="number"
              value={constant}
              onChange={(e) => setConstant(e.target.value)}
              required
              min="0"
              step="0.00001"
            />
          </div>
          <Button type="submit" className="w-full">
            {initialValues ? 'Save Changes' : 'Add Diameter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}