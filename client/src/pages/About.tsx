import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Zap, History, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Scanvas</h1>
          <p className="text-xl text-muted-foreground">
            Empowering everyone to build a more inclusive and accessible web.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Scanvas was built to simplify the process of identifying and fixing web accessibility issues. 
              We believe that accessibility should be a foundational part of the development process, not an afterthought.
            </p>
            <p>
              By providing instant, actionable feedback based on industry-standard testing rules (Axe-core), 
              we help developers and site owners create experiences that work for everyone.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-md">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Fast Scanning</h3>
              <p className="text-sm text-muted-foreground">Get results in seconds using our cloud-based scanning engine.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-md">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Industry Standards</h3>
              <p className="text-sm text-muted-foreground">Results based on WCAG 2.1 and 2.2 accessibility guidelines.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-md">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Historical Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor your accessibility improvements over time.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-md">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Inclusive Web</h3>
              <p className="text-sm text-muted-foreground">Join the movement toward a fully accessible internet for all users.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
