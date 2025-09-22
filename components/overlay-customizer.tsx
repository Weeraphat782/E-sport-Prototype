"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Palette, Monitor, Save, Upload, Eye, Gamepad2 } from "lucide-react"

interface OverlayTheme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  tournament?: string
}

interface OverlayElements {
  showViewerCount: boolean
  showChatOverlay: boolean
  showMatchInfo: boolean
  showDonationAlerts: boolean
  showFollowerGoal: boolean
  showRecentFollower: boolean
  showHUD: boolean
  chatOpacity: number
  overlayPosition: string
  selectedHUD: string
}

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  isModerated?: boolean
  originalMessage?: string
}

interface HUDPreset {
  id: string
  name: string
  game: string
  players: Array<{
    name: string
    kills: number
    deaths: number
    assists: number
    score: number
    agent?: string
    weapon?: string
  }>
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  round: number
  time: string
}

const presetThemes: OverlayTheme[] = [
  {
    id: "valorant",
    name: "VALORANT Championship",
    primaryColor: "#ff4655",
    secondaryColor: "#0f1419",
    accentColor: "#00d4aa",
    backgroundColor: "rgba(15, 20, 25, 0.9)",
    textColor: "#ffffff",
    tournament: "VCT",
  },
  {
    id: "lol",
    name: "League Worlds",
    primaryColor: "#c89b3c",
    secondaryColor: "#0a1428",
    accentColor: "#cdbe91",
    backgroundColor: "rgba(10, 20, 40, 0.9)",
    textColor: "#f0e6d2",
    tournament: "Worlds",
  },
  {
    id: "apex",
    name: "Apex Legends",
    primaryColor: "#ff6600",
    secondaryColor: "#1a1a1a",
    accentColor: "#00ff88",
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    textColor: "#ffffff",
    tournament: "ALGS",
  },
  {
    id: "custom",
    name: "Custom Theme",
    primaryColor: "#8b5cf6",
    secondaryColor: "#1e1b4b",
    accentColor: "#ec4899",
    backgroundColor: "rgba(30, 27, 75, 0.9)",
    textColor: "#ffffff",
  },
]

const sampleMessages: Omit<ChatMessage, "id" | "timestamp">[] = [
  { username: "ProGamer123", message: "LIQUID IS INSANE!" },
  { username: "ESportsKing", message: "That clutch was incredible!" },
  { username: "ValFan2024", message: "GG EZ Clap" },
  { username: "StreamViewer", message: "This game is so boring..." },
  { username: "ToxicUser", message: "You suck at this game noob" },
  { username: "GameLover", message: "Amazing plays!" },
  { username: "ChatMod", message: "Keep it positive everyone!" },
  { username: "FanBoy", message: "BEST TEAM EVER!" },
  { username: "Hater123", message: "This is trash gameplay" },
  { username: "SupportFan", message: "Great stream quality!" },
  { username: "RandomUser", message: "When does the next match start?" },
  { username: "TrollAccount", message: "This streamer is terrible" },
  { username: "PositiveVibes", message: "Love the energy!" },
  { username: "GameCritic", message: "Poor decision making" },
  { username: "StreamSupporter", message: "Keep up the great work!" },
]

const hudPresets: HUDPreset[] = [
  {
    id: "valorant",
    name: "VALORANT Match",
    game: "VALORANT",
    teamA: "VVDH",
    teamB: "MVT",
    scoreA: 17,
    scoreB: 17,
    round: 35,
    time: "0:48",
    players: [
      { name: "Jett", kills: 24, deaths: 18, assists: 5, score: 1600, agent: "Jett", weapon: "Vandal" },
      { name: "Killjoy", kills: 19, deaths: 16, assists: 8, score: 3500, agent: "Killjoy", weapon: "Phantom" },
      { name: "Sova", kills: 21, deaths: 15, assists: 6, score: 1850, agent: "Sova", weapon: "Vandal" },
      { name: "Raze", kills: 16, deaths: 19, assists: 12, score: 1300, agent: "Raze", weapon: "Phantom" },
      { name: "Cypher", kills: 18, deaths: 17, assists: 9, score: 2500, agent: "Cypher", weapon: "Vandal" },
      { name: "Omen", kills: 26, deaths: 15, assists: 7, score: 2800, agent: "Omen", weapon: "Vandal" },
      { name: "Sova", kills: 22, deaths: 18, assists: 9, score: 2200, agent: "Sova", weapon: "Phantom" },
      { name: "Breach", kills: 20, deaths: 16, assists: 11, score: 1900, agent: "Breach", weapon: "Vandal" },
      { name: "Phoenix", kills: 17, deaths: 20, assists: 14, score: 1700, agent: "Phoenix", weapon: "Phantom" },
      { name: "Sage", kills: 15, deaths: 19, assists: 16, score: 1400, agent: "Sage", weapon: "Vandal" },
    ],
  },
]

const moderateMessage = (message: string): { isModerated: boolean; moderatedMessage: string } => {
  const toxicWords = ["suck", "noob", "trash", "terrible", "boring", "hate"]
  const lowerMessage = message.toLowerCase()

  const hasToxicContent = toxicWords.some((word) => lowerMessage.includes(word))

  if (hasToxicContent) {
    return {
      isModerated: true,
      moderatedMessage: "[Message moderated by AI]",
    }
  }

  return {
    isModerated: false,
    moderatedMessage: message,
  }
}

export function OverlayCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState<OverlayTheme>(presetThemes[0])
  const [customTheme, setCustomTheme] = useState<OverlayTheme>(presetThemes[3])
  const [overlayElements, setOverlayElements] = useState<OverlayElements>({
    showViewerCount: true,
    showChatOverlay: true,
    showMatchInfo: true,
    showDonationAlerts: true,
    showFollowerGoal: false,
    showRecentFollower: true,
    showHUD: true,
    chatOpacity: 85,
    overlayPosition: "bottom-left",
    selectedHUD: "valorant",
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (overlayElements.showChatOverlay) {
        const newMessage = sampleMessages[messageIndex % sampleMessages.length]
        const moderation = moderateMessage(newMessage.message)

        const chatMessage: ChatMessage = {
          id: Date.now().toString(),
          username: newMessage.username,
          message: moderation.moderatedMessage,
          timestamp: new Date(),
          isModerated: moderation.isModerated,
          originalMessage: moderation.isModerated ? newMessage.message : undefined,
        }

        setChatMessages((prev) => {
          const newMessages = [...prev, chatMessage]
          return newMessages.slice(-5) // Keep only last 5 messages
        })

        setMessageIndex((prev) => prev + 1)
      }
    }, 1500) // Reduced interval from 2000ms to 1500ms for faster chat

    return () => clearInterval(interval)
  }, [messageIndex, overlayElements.showChatOverlay])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const updateCustomTheme = (key: keyof OverlayTheme, value: string) => {
    setCustomTheme((prev) => ({ ...prev, [key]: value }))
  }

  const updateOverlayElement = (key: keyof OverlayElements, value: boolean | number | string) => {
    setOverlayElements((prev) => ({ ...prev, [key]: value }))
  }

  const currentTheme = selectedTheme.id === "custom" ? customTheme : selectedTheme
  const currentHUD = hudPresets.find((hud) => hud.id === overlayElements.selectedHUD) || hudPresets[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customization Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-black/40 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Theme Presets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {presetThemes.map((theme) => (
              <div
                key={theme.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTheme.id === theme.id
                    ? "border-purple-500 bg-purple-900/20"
                    : "border-purple-800/30 bg-slate-800/30 hover:bg-slate-700/30"
                }`}
                onClick={() => setSelectedTheme(theme)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{theme.name}</span>
                  {theme.tournament && (
                    <Badge variant="outline" className="text-xs border-purple-400 text-purple-300">
                      {theme.tournament}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Tabs defaultValue="theme" className="space-y-4">
          <TabsList className="bg-black/40 border border-purple-800/30 w-full">
            <TabsTrigger value="theme" className="data-[state=active]:bg-purple-600">
              Theme
            </TabsTrigger>
            <TabsTrigger value="elements" className="data-[state=active]:bg-purple-600">
              Elements
            </TabsTrigger>
            <TabsTrigger value="hud" className="data-[state=active]:bg-purple-600">
              HUD
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme">
            {selectedTheme.id === "custom" && (
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-sm">Custom Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customTheme.primaryColor}
                        onChange={(e) => updateCustomTheme("primaryColor", e.target.value)}
                        className="w-12 h-8 p-0 border-0"
                      />
                      <Input
                        value={customTheme.primaryColor}
                        onChange={(e) => updateCustomTheme("primaryColor", e.target.value)}
                        className="bg-slate-800/50 border-purple-800/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customTheme.secondaryColor}
                        onChange={(e) => updateCustomTheme("secondaryColor", e.target.value)}
                        className="w-12 h-8 p-0 border-0"
                      />
                      <Input
                        value={customTheme.secondaryColor}
                        onChange={(e) => updateCustomTheme("secondaryColor", e.target.value)}
                        className="bg-slate-800/50 border-purple-800/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customTheme.accentColor}
                        onChange={(e) => updateCustomTheme("accentColor", e.target.value)}
                        className="w-12 h-8 p-0 border-0"
                      />
                      <Input
                        value={customTheme.accentColor}
                        onChange={(e) => updateCustomTheme("accentColor", e.target.value)}
                        className="bg-slate-800/50 border-purple-800/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tournament Name</Label>
                    <Input
                      value={customTheme.tournament || ""}
                      onChange={(e) => updateCustomTheme("tournament", e.target.value)}
                      placeholder="Enter tournament name"
                      className="bg-slate-800/50 border-purple-800/30 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="elements">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-purple-300 text-sm">Overlay Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Viewer Count</Label>
                  <Switch
                    checked={overlayElements.showViewerCount}
                    onCheckedChange={(checked) => updateOverlayElement("showViewerCount", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-white">Chat Overlay</Label>
                  <Switch
                    checked={overlayElements.showChatOverlay}
                    onCheckedChange={(checked) => updateOverlayElement("showChatOverlay", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-white">Match Information</Label>
                  <Switch
                    checked={overlayElements.showMatchInfo}
                    onCheckedChange={(checked) => updateOverlayElement("showMatchInfo", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-white">Donation Alerts</Label>
                  <Switch
                    checked={overlayElements.showDonationAlerts}
                    onCheckedChange={(checked) => updateOverlayElement("showDonationAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-white">Recent Follower</Label>
                  <Switch
                    checked={overlayElements.showRecentFollower}
                    onCheckedChange={(checked) => updateOverlayElement("showRecentFollower", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Chat Opacity: {overlayElements.chatOpacity}%</Label>
                  <Slider
                    value={[overlayElements.chatOpacity]}
                    onValueChange={(value) => updateOverlayElement("chatOpacity", value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Overlay Position</Label>
                  <Select
                    value={overlayElements.overlayPosition}
                    onValueChange={(value) => updateOverlayElement("overlayPosition", value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hud">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Game HUD Presets
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="border-purple-400 text-purple-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {previewMode ? "Exit Preview" : "Full Preview"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Show HUD</Label>
                  <Switch
                    checked={overlayElements.showHUD}
                    onCheckedChange={(checked) => updateOverlayElement("showHUD", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">HUD Preset</Label>
                  <Select
                    value={overlayElements.selectedHUD}
                    onValueChange={(value) => updateOverlayElement("selectedHUD", value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hudPresets.map((hud) => (
                        <SelectItem key={hud.id} value={hud.id}>
                          {hud.name} ({hud.game})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/30 border border-purple-800/20">
                  <div className="text-xs text-purple-300 mb-2">Preview: {currentHUD.name}</div>
                  <div className="text-xs text-white space-y-1">
                    <div>
                      {currentHUD.teamA} vs {currentHUD.teamB}
                    </div>
                    <div className="text-purple-400">
                      {currentHUD.scoreA} - {currentHUD.scoreB}
                    </div>
                    <div>
                      Round {currentHUD.round} • {currentHUD.time}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Save Preset
          </Button>
          <Button variant="outline" className="border-purple-400 text-purple-300 bg-transparent">
            Export
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-black/40 border-purple-800/30 max-w-full w-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-300 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Live Preview
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="border-purple-400 text-purple-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? "Exit Preview" : "Full Preview"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`relative w-full h-[600px] bg-black rounded-lg overflow-hidden max-w-6xl mx-auto`}>
              <img
                src="/Valorant_09-20-2025_23-5-24-359-ezgif.com-video-to-gif-converter.gif"
                alt="Stream Preview"
                className="w-full h-full object-cover"
              />

              {/* Overlay Elements */}
              <div className="absolute inset-0">
                {/* App Name - ArenaX */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="text-5xl font-bold text-white drop-shadow-lg">ArenaX</div>
                </div>
                {/* Top Bar */}
                {overlayElements.showViewerCount && (
                  <div className="absolute top-16 left-4 flex items-center gap-2">
                    <div
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-white text-sm"
                      style={{ backgroundColor: currentTheme.backgroundColor }}
                    >
                      45,672 viewers
                    </div>
                  </div>
                )}

                {/* Match Info */}
                {overlayElements.showMatchInfo && (
                  <div className="absolute top-4 right-4">
                    <div
                      className="p-3 rounded-lg text-white"
                      style={{ backgroundColor: currentTheme.backgroundColor }}
                    >
                      <div className="text-center">
                        <div className="text-xs" style={{ color: currentTheme.accentColor }}>
                          {currentTheme.tournament || "TOURNAMENT"}
                        </div>
                        <div className="text-sm font-bold">Team Liquid vs FNATIC</div>
                        <div className="text-lg font-bold" style={{ color: currentTheme.primaryColor }}>
                          13 - 11
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Overlay */}
                {overlayElements.showChatOverlay && (
                  <div
                    className={`absolute ${
                      overlayElements.overlayPosition.includes("bottom") ? "bottom-4" : "top-20"
                    } ${overlayElements.overlayPosition.includes("right") ? "right-4" : "left-4"} w-80`}
                  >
                    <div
                      className="p-3 rounded-lg text-white text-sm space-y-2"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        opacity: overlayElements.chatOpacity / 100,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs font-medium" style={{ color: currentTheme.accentColor }}>
                          STREAM CHAT
                        </div>
                        <div className="text-xs text-green-400 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          AI Moderated
                        </div>
                      </div>
                      <div ref={chatContainerRef} className="space-y-1 max-h-32 overflow-y-auto scroll-smooth">
                        {chatMessages.length === 0 ? (
                          <div className="text-gray-400 text-xs animate-pulse">Waiting for messages...</div>
                        ) : (
                          chatMessages.map((msg, index) => (
                            <div
                              key={msg.id}
                              className={`flex flex-col animate-in slide-in-from-bottom-2 duration-300 ${
                                index === chatMessages.length - 1 ? "animate-in fade-in duration-500" : ""
                              }`}
                            >
                              <div>
                                <span style={{ color: currentTheme.primaryColor }} className="font-medium">
                                  {msg.username}:
                                </span>
                                <span className={`ml-2 ${msg.isModerated ? "text-gray-400 italic" : ""}`}>
                                  {msg.message}
                                </span>
                              </div>
                              {msg.isModerated && (
                                <div className="text-xs text-red-400 ml-2 opacity-75">
                                  ⚠️ Original: {msg.originalMessage}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Follower */}
                {overlayElements.showRecentFollower && (
                  <div className="absolute bottom-4 right-4">
                    <div
                      className="p-3 rounded-lg text-white text-sm"
                      style={{ backgroundColor: currentTheme.backgroundColor }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-xs" style={{ color: currentTheme.accentColor }}>
                          NEW FOLLOWER
                        </div>
                      </div>
                      <div className="font-medium">StreamViewer2024</div>
                    </div>
                  </div>
                )}

                {/* Donation Alert (Example) */}
                {overlayElements.showDonationAlerts && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="p-4 rounded-lg text-white text-center animate-pulse"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    >
                      <div className="text-lg font-bold">$25 Donation!</div>
                      <div className="text-sm">Thank you GameSupporter!</div>
                    </div>
                  </div>
                )}

                {/* Game HUD */}
                {overlayElements.showHUD && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top Score Bar */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-2 bg-black/90 rounded-lg px-4 py-2 border border-gray-600 text-sm">
                        {/* Team A */}
                        <div className="flex items-center gap-2">
                          <div className="text-white font-bold">{currentHUD.teamA}</div>
                          <div className="bg-green-600 text-white font-bold px-3 py-1 rounded text-sm">
                            {currentHUD.scoreA}
                          </div>
                        </div>

                        {/* Round and Time */}
                        <div className="text-center px-3">
                          <div className="text-gray-300 text-xs">ROUND {currentHUD.round}</div>
                          <div className="text-white font-bold text-lg">{currentHUD.time}</div>
                        </div>

                        {/* Team B */}
                        <div className="flex items-center gap-2">
                          <div className="bg-red-600 text-white font-bold px-3 py-1 rounded text-sm">
                            {currentHUD.scoreB}
                          </div>
                          <div className="text-white font-bold">{currentHUD.teamB}</div>
                        </div>
                      </div>
                    </div>

                    {/* Player Cards - Left Side (Team A) */}
                    <div className="absolute left-2 bottom-16 space-y-1">
                      {currentHUD.players.slice(0, 5).map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-blue-900/90 rounded-lg p-2 border border-blue-600 min-w-[200px] text-xs"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={`/images/${player.agent?.toLowerCase()}.webp`}
                              alt={player.agent}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                            <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center hidden">
                              <div className="text-white font-bold text-xs">{player.agent?.charAt(0) || "A"}</div>
                            </div>
                          </div>

                          {/* Player Info */}
                          <div className="flex-1">
                            <div className="text-white font-bold text-xs">{player.name}</div>
                            <div className="text-blue-300 text-xs">{player.agent}</div>
                          </div>

                          {/* Money */}
                          <div className="text-green-400 font-bold text-xs">₹{player.score}</div>

                          {/* Weapon Icons */}
                          <div className="flex flex-col gap-1">
                            <img
                              src={player.weapon === "Phantom" ? "/images/phantom.png" : "/images/vandal.webp"}
                              alt={player.weapon}
                              className="w-8 h-4 object-contain"
                            />
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Player Cards - Right Side (Team B) */}
                    <div className="absolute right-2 bottom-16 space-y-1">
                      {currentHUD.players.slice(5, 10).map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-red-900/90 rounded-lg p-2 border border-red-600 min-w-[200px] text-xs"
                        >
                          {/* Weapon Icons */}
                          <div className="flex flex-col gap-1">
                            <img
                              src={player.weapon === "Phantom" ? "/images/phantom.png" : "/images/vandal.webp"}
                              alt={player.weapon}
                              className="w-8 h-4 object-contain"
                            />
                            <div className="flex gap-1">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                              ))}
                            </div>
                          </div>

                          {/* Money */}
                          <div className="text-green-400 font-bold text-xs">₹{player.score}</div>

                          {/* Player Info */}
                          <div className="flex-1 text-right">
                            <div className="text-white font-bold text-xs">{player.name}</div>
                            <div className="text-red-300 text-xs">{player.agent}</div>
                          </div>

                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={`/images/${player.agent?.toLowerCase()}.webp`}
                              alt={player.agent}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                            <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center hidden">
                              <div className="text-white font-bold text-xs">{player.agent?.charAt(0) || "A"}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-black/40 border-purple-800/30">
          <CardHeader>
            <CardTitle className="text-purple-300 text-sm">Export & Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-purple-400 text-purple-300 bg-transparent">
                Export CSS
              </Button>
              <Button variant="outline" className="border-purple-400 text-purple-300 bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                OBS Integration
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-purple-800/20">
              <div className="text-xs text-white mb-1">OBS Browser Source URL:</div>
              <div className="text-xs text-white font-mono bg-black/40 p-2 rounded overflow-x-auto whitespace-nowrap">
                https://gamestream.app/overlay/{currentTheme.id}?elements={JSON.stringify(overlayElements)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
