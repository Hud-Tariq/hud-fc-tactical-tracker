import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Loader2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamCreationProps {
  onCreateTeam?: (team: { name: string; short_name?: string; home_color?: string; away_color?: string }) => Promise<any>;
  trigger?: React.ReactNode;
}

const TeamCreation = ({ onCreateTeam, trigger }: TeamCreationProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    home_color: '#6366f1',
    away_color: '#ec4899',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (onCreateTeam) {
        await onCreateTeam({
          name: formData.name.trim(),
          short_name: formData.short_name.trim() || undefined,
          home_color: formData.home_color,
          away_color: formData.away_color,
        });
      }
      
      setOpen(false);
      setFormData({
        name: '',
        short_name: '',
        home_color: '#6366f1',
        away_color: '#ec4899',
      });
    } catch (error: any) {
      console.error('Error creating team:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Create Team
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Create New Team
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name *</Label>
                <Input
                  id="team-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Thunder Bolts FC"
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="short-name">Short Name</Label>
                <Input
                  id="short-name"
                  value={formData.short_name}
                  onChange={(e) => handleInputChange('short_name', e.target.value)}
                  placeholder="e.g., TBF (optional)"
                  className="h-11"
                  maxLength={5}
                />
                <p className="text-xs text-muted-foreground">Maximum 5 characters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="home-color" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Home Color
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="home-color"
                      type="color"
                      value={formData.home_color}
                      onChange={(e) => handleInputChange('home_color', e.target.value)}
                      className="w-12 h-11 p-1 border rounded"
                    />
                    <Input
                      value={formData.home_color}
                      onChange={(e) => handleInputChange('home_color', e.target.value)}
                      placeholder="#6366f1"
                      className="flex-1 h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="away-color" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Away Color
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="away-color"
                      type="color"
                      value={formData.away_color}
                      onChange={(e) => handleInputChange('away_color', e.target.value)}
                      className="w-12 h-11 p-1 border rounded"
                    />
                    <Input
                      value={formData.away_color}
                      onChange={(e) => handleInputChange('away_color', e.target.value)}
                      placeholder="#ec4899"
                      className="flex-1 h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Team Preview */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="mt-2 p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: formData.home_color }}
                    >
                      {formData.short_name || formData.name.charAt(0) || 'T'}
                    </div>
                    <span className="font-medium">{formData.name || 'Team Name'}</span>
                  </div>
                  <div 
                    className="w-6 h-6 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: formData.away_color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim()}
              className="bg-[var(--gradient-primary)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Team
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamCreation;
