import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudLightningIcon, HeartIcon } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="text-center">
      <h1 className="text-[40px] mt-3 mb-8">Shop</h1>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="flex w-full max-w-xs flex-col gap-4 rounded-2xl border p-6 shadow-md">
            <div className="flex items-center gap-4">
              <HeartIcon className="h-12 w-12 text-pink-500" />
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Refill Hearts</h3>
                <p className="text-muted-foreground">150 tokens</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Never run out of chances! Get extra hearts to keep learning and
              mastering your courses. Stay motivated and ace your lessons
              without interruptions.
            </p>
            <Button className="w-full" variant="default">
              Buy Now
            </Button>
          </Card>
          <Card className="flex w-full max-w-xs flex-col gap-4 rounded-2xl border p-6 shadow-md">
            <div className="flex items-center gap-4">
              <CloudLightningIcon className="h-12 w-12 text-yellow-500" />
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Point Multiplier</h3>
                <p className="text-muted-foreground">200 tokens</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Supercharge your study sessions for 1 whole hour with our Point Multiplier! Earn
              extra points for every activity you complete with Panda
              Buddy.
            </p>
            <Button className="w-full" variant="default">
              Buy Now
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
