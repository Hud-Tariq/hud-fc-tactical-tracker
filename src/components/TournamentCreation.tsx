import React, { useState } from 'react';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Trophy, Users, Settings, DollarSign } from 'lucide-react';
import { CreateTournamentRequest, TournamentFormat, TournamentVisibility } from '@/types/tournament';
import { useToast } from '@/hooks/use-toast';

interface TournamentCreationProps {
  onCreateTournament?: (tournament: CreateTournamentRequest) => Promise<void>;
  trigger?: React.ReactNode;
}

const TournamentCreation = ({ onCreateTournament, trigger }: TournamentCreationProps) => {
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
        {trigger || (
          <Button
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Tournament
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card-strong border-white/20 text-on-dark rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-on-dark font-poppins">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            Create New Tournament
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-gradient-to-br from-black/30 to-black/20 border border-white/20 rounded-2xl">
            <TabsTrigger
              value="basic"
              className="flex items-center gap-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="flex items-center gap-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Teams</span>
            </TabsTrigger>
            <TabsTrigger
              value="prizes"
              className="flex items-center gap-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Prizes</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="floating-card border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-bold text-on-dark font-poppins mb-6">Tournament Details</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-on-dark-muted">Tournament Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Summer Champions League"
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="visibility" className="text-on-dark-muted">Visibility</Label>
                      <Select value={formData.visibility} onValueChange={(value: TournamentVisibility) => handleInputChange('visibility', value)}>
                        <SelectTrigger className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card-strong border-white/20 rounded-xl">
                          <SelectItem value="public" className="text-on-dark hover:bg-white/10">Public - Anyone can join</SelectItem>
                          <SelectItem value="private" className="text-on-dark hover:bg-white/10">Private - Invitation only</SelectItem>
                          <SelectItem value="invite_only" className="text-on-dark hover:bg-white/10">Invite Only - Admin approval required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-on-dark-muted">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your tournament..."
                      rows={3}
                      className="bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date" className="text-on-dark-muted">Start Date</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end_date" className="text-on-dark-muted">End Date</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6 mt-6">
            <div className="floating-card border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-bold text-on-dark font-poppins mb-6">Tournament Format</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formatOptions.map((format) => (
                      <div 
                        key={format.value}
                        className={`cursor-pointer transition-all duration-200 p-4 rounded-xl border ${
                          formData.format === format.value 
                            ? 'border-yellow-400/50 bg-yellow-500/10 shadow-lg' 
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => handleInputChange('format', format.value as TournamentFormat)}
                      >
                        <h4 className="font-semibold mb-2 text-on-dark">{format.label}</h4>
                        <p className="text-sm text-on-dark-muted">{format.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_teams" className="text-on-dark-muted">Minimum Teams</Label>
                      <Input
                        id="min_teams"
                        type="number"
                        min="2"
                        max="64"
                        value={formData.min_teams}
                        onChange={(e) => handleInputChange('min_teams', parseInt(e.target.value))}
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max_teams" className="text-on-dark-muted">Maximum Teams</Label>
                      <Input
                        id="max_teams"
                        type="number"
                        min="2"
                        max="64"
                        value={formData.max_teams}
                        onChange={(e) => handleInputChange('max_teams', parseInt(e.target.value))}
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6 mt-6">
            <div className="floating-card border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-bold text-on-dark font-poppins mb-6">Financial Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry_fee" className="text-on-dark-muted">Entry Fee ($)</Label>
                      <Input
                        id="entry_fee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.entry_fee}
                        onChange={(e) => handleInputChange('entry_fee', parseFloat(e.target.value) || 0)}
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400"
                      />
                      <p className="text-xs text-on-dark-subtle">Set to 0 for free tournaments</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prize_pool" className="text-on-dark-muted">Prize Pool ($)</Label>
                      <Input
                        id="prize_pool"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.prize_pool}
                        onChange={(e) => handleInputChange('prize_pool', parseFloat(e.target.value) || 0)}
                        className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="floating-card border border-white/10">
              <div className="p-6">
                <h3 className="text-xl font-bold text-on-dark font-poppins mb-6">Match Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="match_duration" className="text-on-dark-muted">Match Duration (minutes)</Label>
                    <Input
                      id="match_duration"
                      type="number"
                      min="30"
                      max="120"
                      value={formData.match_duration}
                      onChange={(e) => handleInputChange('match_duration', parseInt(e.target.value))}
                      className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-on-dark">Extra Time</Label>
                        <p className="text-sm text-on-dark-muted">Allow extra time for knockout matches</p>
                      </div>
                      <Switch
                        checked={formData.extra_time_enabled}
                        onCheckedChange={(checked) => handleInputChange('extra_time_enabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-on-dark">Penalty Shootouts</Label>
                        <p className="text-sm text-on-dark-muted">Enable penalty shootouts for tied matches</p>
                      </div>
                      <Switch
                        checked={formData.penalty_shootouts_enabled}
                        onCheckedChange={(checked) => handleInputChange('penalty_shootouts_enabled', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rules_text" className="text-on-dark-muted">Custom Rules</Label>
                    <Textarea
                      id="rules_text"
                      value={formData.rules_text || ''}
                      onChange={(e) => handleInputChange('rules_text', e.target.value)}
                      placeholder="Add any special rules or regulations..."
                      rows={4}
                      className="bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>
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
                className="bg-white/10 border-white/20 text-on-dark hover:bg-white/20 hover:text-on-dark"
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
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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
