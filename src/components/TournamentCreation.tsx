import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Trophy, Users, Settings, DollarSign } from 'lucide-react';
import { CreateTournamentRequest, TournamentFormat, TournamentVisibility } from '@/types/tournament';
import { useToast } from '@/hooks/use-toast';

interface TournamentCreationProps {
  onCreateTournament?: (tournament: CreateTournamentRequest) => Promise<void>;
  trigger?: React.ReactNode;
}

const TournamentCreation = ({ onCreateTournament }: TournamentCreationProps) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('basic');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateTournamentRequest>({
    name: '',
    description: '',
    format: 'single_elimination',
    visibility: 'public',
    max_teams: 16,
    min_teams: 4,
    entry_fee: 0,
    prize_pool: 0,
    match_duration: 90,
    extra_time_enabled: false,
    penalty_shootouts_enabled: true,
  });

  const handleInputChange = (field: keyof CreateTournamentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Tournament name is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.min_teams! > formData.max_teams!) {
      toast({
        title: "Error",
        description: "Minimum teams cannot exceed maximum teams",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (onCreateTournament) {
        await onCreateTournament(formData);
      }
      
      toast({
        title: "Success!",
        description: "Tournament created successfully",
      });
      
      setOpen(false);
      setCurrentStep('basic');
      setFormData({
        name: '',
        description: '',
        format: 'single_elimination',
        visibility: 'public',
        max_teams: 16,
        min_teams: 4,
        entry_fee: 0,
        prize_pool: 0,
        match_duration: 90,
        extra_time_enabled: false,
        penalty_shootouts_enabled: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tournament",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatOptions = [
    { value: 'single_elimination', label: 'Single Elimination', description: 'Knockout format - lose and you\'re out' },
    { value: 'double_elimination', label: 'Double Elimination', description: 'Two losses eliminate a team' },
    { value: 'league', label: 'League', description: 'Everyone plays everyone' },
    { value: 'group_stage', label: 'Group Stage', description: 'Groups followed by knockout' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 px-4 sm:px-6 py-2 sm:py-3"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Create Tournament</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-primary" />
            Create New Tournament
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams & Format
            </TabsTrigger>
            <TabsTrigger value="prizes" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Prizes & Fees
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tournament Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Summer Champions League"
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={formData.visibility} onValueChange={(value: TournamentVisibility) => handleInputChange('visibility', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can join</SelectItem>
                        <SelectItem value="private">Private - Invitation only</SelectItem>
                        <SelectItem value="invite_only">Invite Only - Admin approval required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your tournament..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formatOptions.map((format) => (
                    <Card 
                      key={format.value}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.format === format.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleInputChange('format', format.value as TournamentFormat)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{format.label}</h3>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_teams">Minimum Teams</Label>
                    <Input
                      id="min_teams"
                      type="number"
                      min="2"
                      max="64"
                      value={formData.min_teams}
                      onChange={(e) => handleInputChange('min_teams', parseInt(e.target.value))}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_teams">Maximum Teams</Label>
                    <Input
                      id="max_teams"
                      type="number"
                      min="2"
                      max="64"
                      value={formData.max_teams}
                      onChange={(e) => handleInputChange('max_teams', parseInt(e.target.value))}
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry_fee">Entry Fee ($)</Label>
                    <Input
                      id="entry_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.entry_fee}
                      onChange={(e) => handleInputChange('entry_fee', parseFloat(e.target.value) || 0)}
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">Set to 0 for free tournaments</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                    <Input
                      id="prize_pool"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.prize_pool}
                      onChange={(e) => handleInputChange('prize_pool', parseFloat(e.target.value) || 0)}
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="match_duration">Match Duration (minutes)</Label>
                  <Input
                    id="match_duration"
                    type="number"
                    min="30"
                    max="120"
                    value={formData.match_duration}
                    onChange={(e) => handleInputChange('match_duration', parseInt(e.target.value))}
                    className="h-12"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Extra Time</Label>
                      <p className="text-sm text-muted-foreground">Allow extra time for knockout matches</p>
                    </div>
                    <Switch
                      checked={formData.extra_time_enabled}
                      onCheckedChange={(checked) => handleInputChange('extra_time_enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Penalty Shootouts</Label>
                      <p className="text-sm text-muted-foreground">Enable penalty shootouts for tied matches</p>
                    </div>
                    <Switch
                      checked={formData.penalty_shootouts_enabled}
                      onCheckedChange={(checked) => handleInputChange('penalty_shootouts_enabled', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rules_text">Custom Rules</Label>
                  <Textarea
                    id="rules_text"
                    value={formData.rules_text || ''}
                    onChange={(e) => handleInputChange('rules_text', e.target.value)}
                    placeholder="Add any special rules or regulations..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6">
          <div className="flex gap-2">
            {currentStep !== 'basic' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  const steps = ['basic', 'teams', 'prizes', 'settings'];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1]);
                  }
                }}
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {currentStep !== 'settings' ? (
              <Button 
                onClick={() => {
                  const steps = ['basic', 'teams', 'prizes', 'settings'];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1]);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-[var(--gradient-primary)]"
              >
                {loading ? 'Creating...' : 'Create Tournament'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentCreation;
