"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, toast } from '@/components/ui/uicomponents';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { MapPin, Phone, Instagram, Facebook, Save, Palette, Type, LayoutTemplate, Box, Video, MessageCircle, Globe, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeSettings } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function BrandStudio() {
  const { user } = useAuth();
  const { t } = useLanguage(); 
  const [loading, setLoading] = useState(false);
  
  const [logo, setLogo] = useState(user?.logo_url);
  const [cover, setCover] = useState(user?.hero_image_url);
  
  const safeVal = (v: any) => typeof v === 'string' ? v : '';

  const [profileData, setProfileData] = useState({
      name: safeVal(user?.name),
      subdomain: safeVal(user?.subdomain),
      address: safeVal(user?.address),
      phone: safeVal(user?.phone),
  });

  const [socials, setSocials] = useState({
      facebook: safeVal(user?.facebook),
      instagram: safeVal(user?.instagram),
      tiktok: safeVal(user?.tiktok),
      whatsapp: safeVal(user?.whatsapp)
  });
  
  const [theme, setTheme] = useState<ThemeSettings>(user?.theme_settings || {
      primaryColor: user?.primary_color || '#c75c2e',
      backgroundColor: '#F8FAFC',
      surfaceColor: '#FFFFFF',
      textColor: '#0f172a',
      borderRadius: '1.5rem',
      fontHeading: 'Playfair Display',
      fontBody: 'Inter',
      buttonStyle: 'filled',
      inputStyle: 'modern',
      layoutMode: 'comfortable',
      columnLayout: '2'
  });

  const handleSave = async () => {
    setLoading(true);
    
    if (isSupabaseConfigured && user?.id) {
        try {
            const fullPayload = {
                logo_url: logo,
                hero_image_url: cover,
                name: profileData.name,
                subdomain: profileData.subdomain,
                address: profileData.address,
                phone: profileData.phone,
                facebook: socials.facebook,
                instagram: socials.instagram,
                tiktok: socials.tiktok,
                whatsapp: socials.whatsapp,
                primary_color: theme.primaryColor,
                theme_settings: theme,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('restaurants')
                .update(fullPayload)
                .eq('id', user.id);

            if (error) throw error;
            toast.success(t('saved'));

        } catch (e: any) {
            toast.error(t('error'));
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(t('saved'));
    }
    setLoading(false);
  };

  const ColorInput = ({ label, value, onChange, icon: Icon }: any) => (
      <div className="space-y-2">
          <Label>{label}</Label>
          <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl">
             <div className="relative w-10 h-10 shrink-0">
                <input 
                    type="color" 
                    value={typeof value === 'string' ? value : '#000000'} 
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-full rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: typeof value === 'string' ? value : '#000000' }} />
             </div>
             <div className="flex-1 min-w-0">
                 <input 
                    type="text" 
                    value={typeof value === 'string' ? value : ''} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-sm font-mono text-slate-600 dark:text-slate-300 outline-none uppercase"
                 />
             </div>
             {Icon && <Icon size={16} className="text-slate-400 mr-2" />}
          </div>
      </div>
  );

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 dark:text-slate-100">
      <div className="sticky top-0 z-30 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6 -mx-6 md:px-0 md:mx-0 border-b border-slate-200/50 dark:border-slate-800 md:border-none md:bg-transparent">
        <div>
           <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{t('brandTitle')}</h1>
           <p className="text-slate-500 dark:text-slate-400">{t('brandDesc')}</p>
        </div>
        <Button size="lg" onClick={handleSave} isLoading={loading} className="shadow-lg shadow-primary/30 bg-[#c25e00] hover:bg-[#a04e00] text-white">
          {!loading && <Save className="mr-2 h-4 w-4" />} {loading ? t('loading') : t('save')}
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-7 space-y-8">
            
            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader>
                <CardTitle className="dark:text-white">{t('identityInfo')}</CardTitle>
                <CardDescription className="dark:text-slate-400">{t('identityDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>{t('logo')}</Label>
                            <div className="flex justify-center">
                                <ImageUpload value={logo} onChange={setLogo} aspectRatio={1} label={t('logo')} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label>{t('banner')}</Label>
                            <ImageUpload value={cover} onChange={setCover} aspectRatio={16/9} label={t('banner')} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('restName')}</Label>
                            <Input 
                                value={profileData.name} 
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                                placeholder="Chez Tonton"
                                className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('identifier')}</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400 text-xs">menu.com/</span>
                                <Input 
                                    value={profileData.subdomain} 
                                    onChange={(e) => setProfileData({...profileData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                                    className="pl-20 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    placeholder="chez-tonton"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('address')}</Label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <Input 
                                    value={profileData.address} 
                                    onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    placeholder="Dakar, Sénégal"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('phone')}</Label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <Input 
                                    value={profileData.phone} 
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    placeholder="+221 77 000 00 00"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader>
                    <CardTitle className="dark:text-white">{t('socialNetworks')}</CardTitle>
                    <CardDescription className="dark:text-slate-400">{t('socialDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Facebook</Label>
                        <div className="relative">
                            <Facebook size={18} className="absolute left-3 top-3 text-blue-600" />
                            <Input 
                                value={socials.facebook} 
                                onChange={(e) => setSocials({...socials, facebook: e.target.value})} 
                                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                                placeholder="facebook.com/page" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Instagram</Label>
                        <div className="relative">
                            <Instagram size={18} className="absolute left-3 top-3 text-pink-600" />
                            <Input 
                                value={socials.instagram} 
                                onChange={(e) => setSocials({...socials, instagram: e.target.value})} 
                                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                                placeholder="@monrestaurant" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>TikTok</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-3"><TikTokLogo /></div>
                            <Input 
                                value={socials.tiktok} 
                                onChange={(e) => setSocials({...socials, tiktok: e.target.value})} 
                                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                                placeholder="@tonton_tiktok" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-3 text-[#25D366]"><WhatsAppLogo /></div>
                            <Input 
                                value={socials.whatsapp} 
                                onChange={(e) => setSocials({...socials, whatsapp: e.target.value})} 
                                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                                placeholder="+221..." 
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-slate-800">
                <CardHeader>
                    <CardTitle className="dark:text-white">{t('colorPalette')}</CardTitle>
                    <CardDescription className="dark:text-slate-400">{t('colorDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-6">
                    <ColorInput label={t('primaryColor')} value={theme.primaryColor} onChange={(c: string) => setTheme({...theme, primaryColor: c})} icon={Palette} />
                    <ColorInput label={t('bgColorPage')} value={theme.backgroundColor} onChange={(c: string) => setTheme({...theme, backgroundColor: c})} icon={LayoutTemplate} />
                    <ColorInput label={t('cardColor')} value={theme.surfaceColor} onChange={(c: string) => setTheme({...theme, surfaceColor: c})} icon={Box} />
                    <ColorInput label={t('textColor')} value={theme.textColor} onChange={(c: string) => setTheme({...theme, textColor: c})} icon={Type} />
                </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-5">
             <div className="sticky top-24">
                 <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[4px] border-slate-800 ring-1 ring-white/10">
                     <div className="rounded-[2.5rem] overflow-hidden h-[750px] relative flex flex-col transition-colors duration-500" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                        <div className="h-44 relative shrink-0">
                            <img src={cover || "https://picsum.photos/800/400"} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-xl font-serif">{profileData.name || t('restName')}</h3>
                                    <div className="w-10 h-10 bg-white rounded-full p-0.5 overflow-hidden">
                                        <img src={logo || "https://via.placeholder.com/50"} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                </div>
                                <p className="text-[10px] opacity-80 line-clamp-1">{profileData.address || t('address')}</p>
                            </div>
                        </div>

                        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/10 shrink-0 bg-inherit/90 backdrop-blur sticky top-0 z-10">
                            <div className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-default text-white" style={{ backgroundColor: theme.primaryColor }}>
                                Entrées
                            </div>
                            <div className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-default opacity-60 border border-current">
                                Plats
                            </div>
                            <div className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-default opacity-60 border border-current">
                                Desserts
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                            <div>
                                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Entrées</h4>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-2xl shadow-sm flex gap-3" style={{ backgroundColor: theme.surfaceColor }}>
                                        <div className="h-16 w-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-bold text-sm truncate">Poulet Yassa</h5>
                                                <span className="font-bold text-xs whitespace-nowrap" style={{ color: theme.primaryColor }}>4 500 F</span>
                                            </div>
                                            <p className="text-[10px] opacity-60 line-clamp-2 mt-1">Mariné au citron vert et aux oignons caramélisés.</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2xl shadow-sm flex gap-3" style={{ backgroundColor: theme.surfaceColor }}>
                                        <div className="h-16 w-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                            <div className="w-full h-full bg-slate-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-bold text-sm truncate">Salade Niçoise</h5>
                                                <span className="font-bold text-xs whitespace-nowrap" style={{ color: theme.primaryColor }}>3 000 F</span>
                                            </div>
                                            <p className="text-[10px] opacity-60 line-clamp-2 mt-1">Thon frais, olives, oeufs durs et légumes croquants.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-1 bg-black/20 mx-auto w-1/3 rounded-full absolute bottom-2 left-0 right-0 pointer-events-none" />
                     </div>
                 </div>
                 <p className="text-center text-slate-400 text-[10px] mt-4 uppercase tracking-widest font-bold">{t('livePreview')}</p>
             </div>
         </div>
      </div>
    </div>
  );
}
