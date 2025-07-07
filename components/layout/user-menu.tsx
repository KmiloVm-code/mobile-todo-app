"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  Bell,
  Globe,
  Eye,
  ChevronRight,
  Shield,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-provider";

export default function UserMenu() {
  const { user, logout, updatePreferences } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

  const handlePreferenceChange = (
    key: keyof typeof user.preferences,
    value: any
  ) => {
    updatePreferences({ [key]: value });
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5 text-amber-600" />;
      case "dark":
        return <Moon className="w-5 h-5 text-indigo-600" />;
      default:
        return <Monitor className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <>
      {/* User Avatar Button */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-full p-0 hover:ring-2 hover:ring-purple-200 dark:hover:ring-purple-800"
          >
            <Avatar className="h-10 w-10 ring-2 ring-purple-200 dark:ring-purple-800">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-md rounded-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              👤 Mi Perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Info */}
            <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-slate-800 shadow-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {user.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {user.email}
                    </p>
                    <Badge className="mt-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                      ✨ Usuario Premium
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Sections */}
            <div className="space-y-4">
              {/* Theme Selector */}
              <Card className="border-0 shadow-sm rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                        {getThemeIcon()}
                      </div>
                      <div>
                        <Label className="font-semibold text-slate-800 dark:text-slate-100">
                          Tema
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Personaliza la apariencia
                        </p>
                      </div>
                    </div>
                    <Select
                      value={theme}
                      onValueChange={(value: "light" | "dark" | "system") =>
                        setTheme(value)
                      }
                    >
                      <SelectTrigger className="w-28 h-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectItem
                          value="light"
                          className="dark:text-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Claro
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="dark"
                          className="dark:text-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Oscuro
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="system"
                          className="dark:text-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Sistema
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-0 shadow-sm rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <Label className="font-semibold text-slate-800 dark:text-slate-100">
                          Notificaciones
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Recibir recordatorios
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.preferences.notifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("notifications", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Language */}
              <Card className="border-0 shadow-sm rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <Label className="font-semibold text-slate-800 dark:text-slate-100">
                          Idioma
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Selecciona tu idioma
                        </p>
                      </div>
                    </div>
                    <Select
                      value={user.preferences.language}
                      onValueChange={(value: "es" | "en") =>
                        handlePreferenceChange("language", value)
                      }
                    >
                      <SelectTrigger className="w-24 h-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectItem value="es" className="dark:text-slate-100">
                          🇪🇸 ES
                        </SelectItem>
                        <SelectItem value="en" className="dark:text-slate-100">
                          🇺🇸 EN
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Default View */}
              <Card className="border-0 shadow-sm rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <Label className="font-semibold text-slate-800 dark:text-slate-100">
                          Vista por defecto
                        </Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Al abrir la app
                        </p>
                      </div>
                    </div>
                    <Select
                      value={user.preferences.defaultView}
                      onValueChange={(value: "all" | "pending" | "completed") =>
                        handlePreferenceChange("defaultView", value)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectItem value="all" className="dark:text-slate-100">
                          📋 Todas
                        </SelectItem>
                        <SelectItem
                          value="pending"
                          className="dark:text-slate-100"
                        >
                          ⏳ Pendientes
                        </SelectItem>
                        <SelectItem
                          value="completed"
                          className="dark:text-slate-100"
                        >
                          ✅ Hechas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Menu Options */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-between h-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                disabled
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium">Privacidad y Seguridad</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between h-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                disabled
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium">Ayuda y Soporte</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Button>
            </div>

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="outline"
              className="w-full h-12 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 rounded-xl font-semibold bg-transparent"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
