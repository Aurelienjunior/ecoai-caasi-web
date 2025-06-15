
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dummyAgents = [
  {
    id: 1,
    name: "Aisha Green",
    avatar: "",
    city: "Lagos",
    area: "Ikeja",
    available: true,
    email: "aisha.green@example.com",
    phone: "+2348012345678"
  },
  {
    id: 2,
    name: "Emeka Obi",
    avatar: "",
    city: "Abuja",
    area: "Garki",
    available: false,
    email: "emeka.obi@example.com",
    phone: "+2348098765432"
  },
  {
    id: 3,
    name: "Fatima Bello",
    avatar: "",
    city: "Port Harcourt",
    area: "Trans Amadi",
    available: true,
    email: "fatima.bello@example.com",
    phone: "+2348076543210"
  }
];

const AgentCard = ({ agent }: { agent: typeof dummyAgents[0] }) => (
  <Card className="flex flex-col md:flex-row items-center gap-4 p-4">
    <Avatar className="w-16 h-16">
      {agent.avatar ? (
        <img src={agent.avatar} alt={agent.name} />
      ) : (
        <AvatarFallback>
          {agent.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)}
        </AvatarFallback>
      )}
    </Avatar>
    <div className="flex-1 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="font-bold text-lg">{agent.name}</h3>
        <Badge variant={agent.available ? "default" : "destructive"}>
          {agent.available ? "Available" : "Unavailable"}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{agent.city}, {agent.area}</p>
      <div className="flex gap-4 items-center mt-2">
        <a href={`mailto:${agent.email}`} className="flex items-center text-sm text-blue-700 hover:underline">
          <Mail className="w-4 h-4 mr-1" /> Email
        </a>
        <a href={`tel:${agent.phone}`} className="flex items-center text-sm text-green-700 hover:underline">
          <Phone className="w-4 h-4 mr-1" /> Call
        </a>
      </div>
    </div>
  </Card>
);

const Agent = () => (
  <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
    <DashboardHeader />
    <main className="flex-1 p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Agents Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Connect with our EcoAgents to pick up your sorted waste.
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 mt-6">
        {dummyAgents.map((agent) => (
          <AgentCard agent={agent} key={agent.id} />
        ))}
      </div>
    </main>
    <BottomNav />
  </div>
);

export default Agent;
