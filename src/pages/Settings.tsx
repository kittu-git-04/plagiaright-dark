
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="detection">Detection Settings</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interface Settings</CardTitle>
              <CardDescription>Customize your PlagiaRight experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for scan results</p>
                </div>
                <Switch id="notifications" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="font-medium">Interface Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content History</CardTitle>
              <CardDescription>Manage your scan history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="save-history" className="font-medium">Save Scan History</Label>
                  <p className="text-sm text-muted-foreground">Save your previous plagiarism checks</p>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>
              
              <div>
                <Label className="font-medium">History Retention</Label>
                <p className="text-sm text-muted-foreground mb-4">Keep scan history for this long</p>
                <Select defaultValue="90">
                  <SelectTrigger id="retention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="destructive">Clear All History</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Sensitivity</CardTitle>
              <CardDescription>Configure how sensitive the plagiarism detector should be</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sensitivity" className="font-medium">Sensitivity Level</Label>
                  <span className="text-sm">High</span>
                </div>
                <Slider defaultValue={[75]} max={100} step={1} id="sensitivity" />
                <p className="text-sm text-muted-foreground">
                  Higher sensitivity may detect more instances of potential plagiarism but may increase false positives.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="match-length" className="font-medium">Minimum Match Length</Label>
                <p className="text-sm text-muted-foreground mb-2">Minimum number of words that must match to be considered plagiarism</p>
                <Select defaultValue="8">
                  <SelectTrigger id="match-length">
                    <SelectValue placeholder="Select minimum words" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 words</SelectItem>
                    <SelectItem value="8">8 words</SelectItem>
                    <SelectItem value="10">10 words</SelectItem>
                    <SelectItem value="15">15 words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sources & Exclusions</CardTitle>
              <CardDescription>Configure which sources to check against and exclude</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="font-medium">Sources to Check</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="source-web" className="text-sm">Web Content</Label>
                    <Switch id="source-web" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="source-academic" className="text-sm">Academic Journals</Label>
                    <Switch id="source-academic" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="source-books" className="text-sm">Books & Publications</Label>
                    <Switch id="source-books" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="source-custom" className="text-sm">Your Custom Database</Label>
                    <Switch id="source-custom" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full" variant="outline">
                  Manage Custom Exclusions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Plan</Label>
                  <p className="font-medium">Free Trial</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Checks Remaining</Label>
                  <p className="font-medium">12 / 15</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Member Since</Label>
                  <p className="font-medium">October 2023</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">user@example.com</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="pt-2 space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full">
                  Manage API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
