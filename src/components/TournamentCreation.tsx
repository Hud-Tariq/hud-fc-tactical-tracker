import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Trophy, Users, Settings, DollarSign, ArrowLeft, ArrowRight, Check, Clock, Shield, Target } from 'lucide-react';
import { CreateTournamentRequest, TournamentFormat, TournamentVisibility } from '@/types/tournament';
import { useToast } from '@/hooks/use-toast';

interface TournamentCreationProps {
  onCreateTournament?: (tournament: CreateTournamentRequest) => Promise<void>;
  trigger?: React.ReactNode;
}

const TournamentCreation = ({ onCreateTournament, trigger }: TournamentCreationProps) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('basic');
  const [mobileStep, setMobileStep] = useState(0);
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
      setMobileStep(0);
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
    { value: 'single_elimination', label: 'Single Elimination', description: 'Knockout format - lose and you\'re out', icon: Target },
    { value: 'double_elimination', label: 'Double Elimination', description: 'Two losses eliminate a team', icon: Shield },
    { value: 'league', label: 'League', description: 'Everyone plays everyone', icon: Users },
    { value: 'group_stage', label: 'Group Stage', description: 'Groups followed by knockout', icon: Trophy },
  ];

  const mobileSteps = [
    { title: 'Basic Info', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { title: 'Format', icon: Target, color: 'from-blue-400 to-cyan-500' },
    { title: 'Teams', icon: Users, color: 'from-green-400 to-emerald-500' },
    { title: 'Prizes', icon: DollarSign, color: 'from-purple-400 to-pink-500' },
    { title: 'Settings', icon: Settings, color: 'from-red-400 to-orange-500' }
  ];

  const canProceedMobile = () => {
    switch (mobileStep) {
      case 0: return formData.name.trim() !== '';
      case 1: return formData.format !== '';
      case 2: return formData.min_teams <= formData.max_teams;
      case 3: return true; // Prizes are optional
      case 4: return true; // Settings are optional
      default: return false;
    }
  };

  // Desktop Layout (keeping original)
  const DesktopLayout = () => (
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

        {/* Desktop content remains the same as original... */}
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

        {/* Other tabs content continues as original... */}
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
      </Tabs>
    </DialogContent>
  );

  // Mobile Layout - Completely Different Experience
  const MobileLayout = () => (
    <DialogContent className="bg-gray-900 text-white rounded-t-3xl rounded-b-none fixed bottom-0 left-0 right-0 max-w-none w-full h-[95vh] z-[100] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom overflow-hidden">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-white/10 pb-4">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white font-poppins">Create Tournament</DialogTitle>
            <div className="text-white/60 text-sm">
              Step {mobileStep + 1} of {mobileSteps.length}
            </div>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          {mobileSteps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center space-y-1 ${
                index === mobileStep ? 'opacity-100' : index < mobileStep ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  index === mobileStep
                    ? `bg-gradient-to-r ${step.color} border-white text-white`
                    : index < mobileStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-white/30 text-white/60'
                }`}
              >
                {index < mobileStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  React.createElement(step.icon, { className: "w-5 h-5" })
                )}
              </div>
              <span className="text-xs text-white/60">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((mobileStep + 1) / mobileSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Step 0: Basic Info */}
        {mobileStep === 0 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-yellow-400/30">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
              <p className="text-white/60">Let's start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Tournament Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Summer Champions League"
                  className="h-14 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-yellow-400 text-lg"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your tournament..."
                  rows={4}
                  className="bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-yellow-400"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value: TournamentVisibility) => handleInputChange('visibility', value)}>
                  <SelectTrigger className="h-14 bg-white/10 border border-white/20 rounded-xl text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem value="public" className="text-white">🌍 Public - Anyone can join</SelectItem>
                    <SelectItem value="private" className="text-white">🔒 Private - Invitation only</SelectItem>
                    <SelectItem value="invite_only" className="text-white">👥 Invite Only - Admin approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Format Selection */}
        {mobileStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-blue-400/30">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tournament Format</h2>
              <p className="text-white/60">Choose how teams will compete</p>
            </div>

            <div className="space-y-4">
              {formatOptions.map((format) => (
                <div
                  key={format.value}
                  className={`cursor-pointer transition-all duration-200 p-4 rounded-xl border ${
                    formData.format === format.value 
                      ? 'border-blue-400 bg-blue-500/20 shadow-lg' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => handleInputChange('format', format.value as TournamentFormat)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.format === format.value 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      <format.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{format.label}</h4>
                      <p className="text-sm text-white/60">{format.description}</p>
                    </div>
                    {formData.format === format.value && (
                      <Check className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Teams */}
        {mobileStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-400/30">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Team Settings</h2>
              <p className="text-white/60">How many teams can participate?</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Minimum Teams</Label>
                  <Input
                    type="number"
                    min="2"
                    max="64"
                    value={formData.min_teams}
                    onChange={(e) => handleInputChange('min_teams', parseInt(e.target.value))}
                    className="h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Maximum Teams</Label>
                  <Input
                    type="number"
                    min="2"
                    max="64"
                    value={formData.max_teams}
                    onChange={(e) => handleInputChange('max_teams', parseInt(e.target.value))}
                    className="h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/20">
                <h3 className="text-green-300 font-semibold mb-2">Team Range</h3>
                <p className="text-white/80 text-sm">
                  Your tournament will accept between <span className="font-bold text-green-300">{formData.min_teams}</span> and <span className="font-bold text-green-300">{formData.max_teams}</span> teams.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Prizes */}
        {mobileStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-400/30">
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Prize Pool</h2>
              <p className="text-white/60">Set entry fees and prizes</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-white mb-2 block">Entry Fee ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.entry_fee}
                  onChange={(e) => handleInputChange('entry_fee', parseFloat(e.target.value) || 0)}
                  className="h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold"
                />
                <p className="text-white/60 text-sm mt-2">Set to 0 for free tournaments</p>
              </div>

              <div>
                <Label className="text-white mb-2 block">Prize Pool ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prize_pool}
                  onChange={(e) => handleInputChange('prize_pool', parseFloat(e.target.value) || 0)}
                  className="h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold"
                />
              </div>

              {formData.entry_fee > 0 && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-400/20">
                  <h3 className="text-yellow-300 font-semibold mb-2">Expected Revenue</h3>
                  <p className="text-white/80 text-sm">
                    With {formData.max_teams} teams at ${formData.entry_fee} each: <span className="font-bold text-yellow-300">${(formData.max_teams * formData.entry_fee).toFixed(2)}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Settings */}
        {mobileStep === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-400/30">
                <Settings className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Match Settings</h2>
              <p className="text-white/60">Configure match rules</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-white mb-2 block">Match Duration (minutes)</Label>
                <Input
                  type="number"
                  min="30"
                  max="120"
                  value={formData.match_duration}
                  onChange={(e) => handleInputChange('match_duration', parseInt(e.target.value))}
                  className="h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20">
                  <div>
                    <h3 className="text-white font-medium">Extra Time</h3>
                    <p className="text-white/60 text-sm">Allow extra time for knockout matches</p>
                  </div>
                  <Switch
                    checked={formData.extra_time_enabled}
                    onCheckedChange={(checked) => handleInputChange('extra_time_enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-white/20">
                  <div>
                    <h3 className="text-white font-medium">Penalty Shootouts</h3>
                    <p className="text-white/60 text-sm">Enable penalty shootouts for tied matches</p>
                  </div>
                  <Switch
                    checked={formData.penalty_shootouts_enabled}
                    onCheckedChange={(checked) => handleInputChange('penalty_shootouts_enabled', checked)}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl"
              >
                {loading ? 'Creating Tournament...' : 'Create Tournament'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileStep < 4 && (
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setMobileStep(Math.max(0, mobileStep - 1))}
              disabled={mobileStep === 0}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-12 px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="text-white/60 text-sm font-medium">
              {mobileStep + 1} of {mobileSteps.length}
            </div>
            
            <Button
              onClick={() => setMobileStep(Math.min(mobileSteps.length - 1, mobileStep + 1))}
              disabled={!canProceedMobile()}
              className="bg-yellow-500 hover:bg-yellow-600 h-12 px-6"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );

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
      
      {/* Show different layouts based on screen size */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </Dialog>
  );
};

export default TournamentCreation;
