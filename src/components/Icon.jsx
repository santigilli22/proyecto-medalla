import {
    Beer, Menu, X, Award, Clock, MapPin, CheckCircle2 as CheckCircle, BrainCircuit, ChevronRight, Star,
    Calendar, Camera, Music, Utensils, Crown, Gift, Zap, Quote, Phone, Map as MapIcon, Package,
    Wheat, Thermometer, Flame, FlaskConical, ShoppingBag, HelpCircle, Plus, Minus,
    Volume2, VolumeX, Play, Pause, Trash, Search, Facebook, Instagram, Twitter, ArrowUp, Globe, Share2, Factory, MessageCircle
} from 'lucide-react';

const icons = {
    Beer, Menu, X, Award, Clock, MapPin, CheckCircle, BrainCircuit, ChevronRight, Star,
    Calendar, Camera, Music, Utensils, Crown, Gift, Zap, Quote, Phone, Map: MapIcon, Package,
    Wheat, Thermometer, Flame, FlaskConical, ShoppingBag, HelpCircle, Plus, Minus,
    Volume2, VolumeX, Play, Pause, Trash, Search, Facebook, Instagram, Twitter, ArrowUp, Globe, Share2, Factory, MessageCircle
};

const Icon = ({ name, size = 24, className }) => {
    const LucideIcon = icons[name];
    if (!LucideIcon) return null;
    return <LucideIcon size={size} className={className} />;
};

export default Icon;
