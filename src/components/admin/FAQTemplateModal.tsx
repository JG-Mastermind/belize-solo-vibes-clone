import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Calendar, 
  Camera, 
  MapPin, 
  Users,
  HelpCircle,
  Check,
  X,
  Search,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQTemplate {
  id: string;
  category: 'safety' | 'planning' | 'activities' | 'logistics' | 'culture';
  question: string;
  answer: string;
  seoKeywords: string[];
  icon: React.ReactNode;
}

interface FAQTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (question: string, answer: string) => void;
}

const belizeTourismTemplates: FAQTemplate[] = [
  // Safety Category
  {
    id: 'safety-1',
    category: 'safety',
    question: 'Is Belize safe for solo travelers?',
    answer: 'Absolutely! Belize is considered one of the safest Central American countries for solo travelers. With English as the official language and a stable government, solo adventurers can explore confidently. Popular tourist areas like San Pedro, Caye Caulker, and Placencia have low crime rates. However, as with any destination, use common sense: avoid walking alone at night in urban areas, keep valuables secure, and stay in well-reviewed accommodations.',
    seoKeywords: ['belize safety', 'solo travel belize', 'belize crime rate', 'safe destinations belize'],
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'safety-2',
    category: 'safety',
    question: 'Do I need malaria medication for Belize?',
    answer: 'Malaria risk in Belize is generally low, especially in popular tourist areas. The CDC recommends malaria prophylaxis only for certain rural areas. Most visitors to Belize City, Ambergris Caye, Caye Caulker, and coastal resorts do not need malaria medication. However, if you plan to visit remote jungle areas or stay overnight in rural regions, consult your doctor about preventive medication. Regardless, use insect repellent and wear long sleeves during peak mosquito hours.',
    seoKeywords: ['belize malaria', 'malaria medication belize', 'belize health requirements'],
    icon: <Shield className="h-4 w-4" />
  },
  
  // Planning Category
  {
    id: 'planning-1',
    category: 'planning',
    question: 'What\'s the best time to visit Belize?',
    answer: 'The dry season (December to May) offers the best weather for most activities, with sunny skies and minimal rainfall. This is peak season for diving, snorkeling, and exploring Maya ruins. The wet season (June to November) brings afternoon showers but also fewer crowds and lower prices. Hurricane season runs from June to November, but direct hits are rare. For the best balance of weather and value, consider visiting in late November or early December.',
    seoKeywords: ['best time visit belize', 'belize weather', 'belize seasons', 'when to visit belize'],
    icon: <Calendar className="h-4 w-4" />
  },
  {
    id: 'planning-2',
    category: 'planning',
    question: 'How much should I budget for a week in Belize?',
    answer: 'Budget travelers can manage on $50-80 per day including accommodation, meals, and activities. Mid-range travelers should budget $100-200 per day for comfortable hotels and regular tours. Luxury travelers can expect $300+ per day for premium resorts and exclusive experiences. Key expenses include: accommodation ($20-300/night), meals ($10-50/day), activities ($50-150 each), and domestic flights ($100-200 per flight). Belize is more expensive than neighboring countries due to its tourism focus.',
    seoKeywords: ['belize travel budget', 'cost of travel belize', 'belize expensive', 'budget travel belize'],
    icon: <DollarSign className="h-4 w-4" />
  },
  {
    id: 'planning-3',
    category: 'planning',
    question: 'Do I need a visa for Belize?',
    answer: 'Most visitors do not need a visa for stays up to 30 days. Citizens of the US, Canada, EU countries, Australia, and New Zealand can enter with just a valid passport (valid for at least 6 months). You\'ll receive a tourist stamp allowing a 30-day stay, which can be extended up to 6 months by visiting immigration offices. You may also need proof of onward travel and sufficient funds for your stay. Always check current requirements before traveling as policies can change.',
    seoKeywords: ['belize visa requirements', 'passport belize', 'belize immigration', 'travel documents belize'],
    icon: <MapPin className="h-4 w-4" />
  },

  // Activities Category
  {
    id: 'activities-1',
    category: 'activities',
    question: 'Is the Blue Hole worth visiting?',
    answer: 'The Blue Hole is absolutely worth visiting for experienced divers seeking an iconic bucket-list experience. This world-famous dive site offers encounters with Caribbean reef sharks, stalactites, and unique geological formations at 130+ feet depth. However, it requires Advanced Open Water certification due to depth and conditions. The journey involves a 2+ hour boat ride and costs $250-400 per person. For beginners or those preferring shallow dives, Belize offers hundreds of other spectacular reef sites.',
    seoKeywords: ['blue hole belize', 'blue hole diving', 'belize diving', 'blue hole worth it'],
    icon: <Camera className="h-4 w-4" />
  },
  {
    id: 'activities-2',
    category: 'activities',
    question: 'What are the best Maya ruins to visit in Belize?',
    answer: 'Belize boasts incredible Maya archaeological sites. Caracol is the largest, offering towering pyramids and jungle wildlife. Xunantunich provides stunning views and easy access from San Ignacio. Lamanai combines impressive ruins with wildlife spotting along the river journey. Altun Ha appears on Belikin beer bottles and offers a classic Maya experience. For adventure seekers, Tikal in nearby Guatemala is a day-trip option. Each site offers unique perspectives on ancient Maya civilization.',
    seoKeywords: ['belize maya ruins', 'caracol belize', 'xunantunich', 'lamanai belize', 'maya temples belize'],
    icon: <MapPin className="h-4 w-4" />
  },
  {
    id: 'activities-3',
    category: 'activities',
    question: 'Can I go cave tubing in Belize?',
    answer: 'Cave tubing is one of Belize\'s most popular adventures! Float through ancient Maya underworld caverns on inner tubes, surrounded by stunning stalactites and crystal-clear pools. The most popular sites are near Belize City and San Ignacio. Tours typically include equipment, guides, and transportation. Most caves are suitable for all fitness levels, though some hiking is required. The experience combines history, geology, and adventure. Book with reputable operators who prioritize safety and environmental protection.',
    seoKeywords: ['belize cave tubing', 'cave tubing tour belize', 'underground river belize', 'belize adventure tours'],
    icon: <Camera className="h-4 w-4" />
  },

  // Logistics Category
  {
    id: 'logistics-1',
    category: 'logistics',
    question: 'How do I get around in Belize?',
    answer: 'Transportation options vary by destination. For coastal areas, water taxis and small planes are common. The mainland has bus services connecting major towns, though schedules can be irregular. Rental cars offer flexibility for exploring, but roads can be rough. Golf carts are the primary transport on islands like Ambergris Caye. For longer distances, domestic flights save time and offer scenic views. Many resorts provide transportation packages. Plan ahead as options can be limited during peak season.',
    seoKeywords: ['belize transportation', 'getting around belize', 'belize domestic flights', 'belize water taxi'],
    icon: <MapPin className="h-4 w-4" />
  },
  {
    id: 'logistics-2',
    category: 'logistics',
    question: 'Can I drink tap water in Belize?',
    answer: 'Tap water quality varies throughout Belize. In Belize City and major tourist areas, tap water is generally safe but may taste different due to chlorination. However, most travelers prefer bottled water to avoid any stomach issues. Islands and remote areas may have questionable water quality. Many hotels and restaurants provide filtered or bottled water. Consider bringing a water purification system or water bottles with built-in filters for extended stays or eco-friendly travel.',
    seoKeywords: ['belize tap water', 'safe to drink water belize', 'belize water quality', 'bottled water belize'],
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'logistics-3',
    category: 'logistics',
    question: 'What should I pack for Belize?',
    answer: 'Pack for tropical weather and outdoor activities. Essentials include: lightweight, quick-dry clothing, swimwear, sun hat, reef-safe sunscreen (SPF 30+), insect repellent, and comfortable walking shoes. For water activities, bring water shoes and dry bags. A light rain jacket is useful during wet season. Don\'t forget underwater camera, snorkel gear (if preferred), and any prescription medications. Leave space for souvenirs and consider packing cubes for organization.',
    seoKeywords: ['what to pack belize', 'belize packing list', 'belize travel essentials', 'packing for tropical vacation'],
    icon: <Users className="h-4 w-4" />
  },

  // Culture Category
  {
    id: 'culture-1',
    category: 'culture',
    question: 'What\'s the food like in Belize?',
    answer: 'Belizean cuisine blends Caribbean, Maya, Mexican, and British influences creating unique flavors. Staples include rice and beans (often cooked in coconut milk), stew chicken, and fresh seafood. Must-try dishes include ceviche, conch fritters, hudut (fish in coconut broth), and tamales. Street food offers affordable local flavors. Rum punch and Belikin beer are popular drinks. Vegetarians will find options, though meat and seafood dominate most menus. Fresh tropical fruits are abundant and delicious.',
    seoKeywords: ['belize food', 'belizean cuisine', 'what to eat belize', 'belize local dishes', 'rice and beans belize'],
    icon: <Star className="h-4 w-4" />
  },
  {
    id: 'culture-2',
    category: 'culture',
    question: 'What language is spoken in Belize?',
    answer: 'English is the official language of Belize, making it the only English-speaking country in Central America. However, you\'ll hear a rich mix of languages including Belizean Creole (Kriol), Spanish, Maya languages, and Garifuna. Most people in tourist areas speak clear English, though local accents and phrases may differ from standard American/British English. Learning a few Spanish phrases can be helpful, especially in border areas. This linguistic diversity reflects Belize\'s multicultural heritage.',
    seoKeywords: ['belize language', 'english speaking belize', 'what language belize', 'belizean creole'],
    icon: <Users className="h-4 w-4" />
  }
];

const categoryIcons = {
  safety: <Shield className="h-4 w-4" />,
  planning: <Calendar className="h-4 w-4" />,
  activities: <Camera className="h-4 w-4" />,
  logistics: <MapPin className="h-4 w-4" />,
  culture: <Users className="h-4 w-4" />
};

const categoryColors = {
  safety: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  activities: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  logistics: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  culture: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
};

export const FAQTemplateModal: React.FC<FAQTemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  onInsert 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<FAQTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [activeTab, setActiveTab] = useState('templates');

  const filteredTemplates = belizeTourismTemplates.filter(template =>
    template.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = useCallback((template: FAQTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleInsert = useCallback(() => {
    if (selectedTemplate) {
      onInsert(selectedTemplate.question, selectedTemplate.answer);
      toast.success(`FAQ "${selectedTemplate.question}" inserted successfully! 🌴`);
      onClose();
    }
  }, [selectedTemplate, onInsert, onClose]);

  const handleCustomInsert = useCallback(() => {
    if (customQuestion.trim() && customAnswer.trim()) {
      onInsert(customQuestion, customAnswer);
      toast.success('Custom FAQ inserted successfully! 🌴');
      setCustomQuestion('');
      setCustomAnswer('');
      onClose();
    } else {
      toast.error('Please provide both question and answer');
    }
  }, [customQuestion, customAnswer, onInsert, onClose]);

  const groupedTemplates = belizeTourismTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, FAQTemplate[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-5 w-5 text-belize-orange-500" />
            Belize Tourism FAQ Templates
            <Badge className="bg-belize-green-100 text-belize-green-700 dark:bg-belize-green-900/20 dark:text-belize-green-400">
              SEO Optimized
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Tourism Templates ({belizeTourismTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Custom FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="flex-1 overflow-hidden mt-4">
            <div className="flex flex-col h-full gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQ templates by question, answer, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-auto">
                {/* Template List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-belize-green-700 dark:text-belize-green-400">
                    Select Template ({filteredTemplates.length} available)
                  </h3>
                  
                  {Object.entries(groupedTemplates).map(([category, templates]) => {
                    const filteredCategoryTemplates = templates.filter(t => 
                      filteredTemplates.includes(t)
                    );
                    
                    if (filteredCategoryTemplates.length === 0) return null;
                    
                    return (
                      <Card key={category} className="border border-belize-blue-100 dark:border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm capitalize">
                            {categoryIcons[category as keyof typeof categoryIcons]}
                            {category} ({filteredCategoryTemplates.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {filteredCategoryTemplates.map((template) => (
                            <Card 
                              key={template.id}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedTemplate?.id === template.id 
                                  ? 'ring-2 ring-belize-orange-500 bg-belize-orange-50 dark:bg-belize-orange-900/10' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm mb-1 line-clamp-2">
                                      {template.question}
                                    </p>
                                    <Badge className={`text-xs ${categoryColors[template.category]}`}>
                                      {template.category}
                                    </Badge>
                                  </div>
                                  {selectedTemplate?.id === template.id && (
                                    <Check className="h-4 w-4 text-belize-orange-500 flex-shrink-0" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-belize-green-700 dark:text-belize-green-400">
                    Preview & Insert
                  </h3>
                  
                  {selectedTemplate ? (
                    <Card className="border-2 border-dashed border-belize-blue-200 dark:border-gray-600 bg-gradient-to-br from-belize-blue-50 to-belize-green-50 dark:from-gray-900 dark:to-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="text-xl">❓</span>
                          {selectedTemplate.question}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={categoryColors[selectedTemplate.category]}>
                            {selectedTemplate.category}
                          </Badge>
                          {selectedTemplate.seoKeywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start gap-2 mb-4">
                          <span className="text-belize-green-500 text-xl mt-1">✅</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedTemplate.answer}
                          </p>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {Math.ceil(selectedTemplate.answer.split(' ').length / 200)} min read
                            </span>
                          </div>
                          <Button 
                            onClick={handleInsert}
                            className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Insert FAQ
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <CardContent className="p-8 text-center">
                        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Select a FAQ template to preview</p>
                        <p className="text-sm text-gray-400">
                          Choose from {belizeTourismTemplates.length} professionally crafted Belize tourism Q&As
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 mt-4">
            <Card className="h-full border-belize-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-belize-green-700 dark:text-belize-green-400">
                  Create Custom FAQ
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Write your own tourism-specific questions and answers
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., What's the best way to explore Belize's underwater caves?"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    💡 Tip: Frame as a common traveler concern for better SEO
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Provide a comprehensive answer with practical advice, local insights, and actionable information for travelers..."
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    rows={8}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>💡 Tip: Include specific details, costs, and local recommendations</span>
                    <span>{customAnswer.split(' ').length} words</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCustomInsert}
                    disabled={!customQuestion.trim() || !customAnswer.trim()}
                    className="flex-1 bg-belize-orange-500 hover:bg-belize-orange-600 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Insert Custom FAQ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCustomQuestion('');
                      setCustomAnswer('');
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            🌴 Optimized for Belize tourism SEO & user engagement
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};