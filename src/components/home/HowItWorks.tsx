
import { Camera, Tag, Truck } from "lucide-react";
import React from "react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How It Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Three easy steps to a cleaner city—get paid to make a difference!
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="group grid gap-4 px-4 py-6 rounded-xl bg-gradient-to-br from-green-50 via-white to-green-100 shadow hover:scale-105 hover:shadow-lg transition-transform text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">1. Snap a Photo</h3>
            <p className="text-muted-foreground">
              Use your phone to take a clear picture of your waste.
            </p>
          </div>
          <div className="group grid gap-4 px-4 py-6 rounded-xl bg-gradient-to-br from-yellow-50 via-white to-green-100 shadow hover:scale-105 hover:shadow-lg transition-transform text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Tag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">2. Get a Price</h3>
            <p className="text-muted-foreground">
              Our AI will analyze the volume and type of waste for an instant quote.
            </p>
          </div>
          <div className="group grid gap-4 px-4 py-6 rounded-xl bg-gradient-to-br from-green-100 via-white to-green-50 shadow hover:scale-105 hover:shadow-lg transition-transform text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">3. We Pick It Up</h3>
            <p className="text-muted-foreground">
              An EcoAgent will come at your convenience—no hassle!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
