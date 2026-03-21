"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab";
import { SecurityTab } from "@/components/profile/SecurityTab";

export function ProfileContent() {
  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className="h-9" value="personal">Informações Pessoais</TabsTrigger>
        <TabsTrigger className="h-9" value="security">Segurança</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="space-y-6">
        <PersonalInfoTab />
      </TabsContent>
      <TabsContent value="security" className="space-y-6">
        <SecurityTab />
      </TabsContent>
    </Tabs>
  );
}
