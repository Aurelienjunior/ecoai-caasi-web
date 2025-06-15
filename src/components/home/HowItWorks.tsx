
import { Camera, Tag, Truck } from 'lucide-react';
import React from 'react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Three simple steps to a cleaner city and a heavier pocket.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">1. Snap a Photo</h3>
            <p className="text-muted-foreground">
              Use your smartphone to take a clear picture of the waste you want collected.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Tag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">2. Get a Price</h3>
            <p className="text-muted-foreground">
              Our AI analyzes the volume and type of waste to give you an instant, fair price.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">3. We Pick It Up</h3>
            <p className="text-muted-foreground">
              Local collection agents are notified and will pick up your trash at your convenience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
