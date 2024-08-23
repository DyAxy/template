"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from 'next-nprogress-bar';

export default function Component() {
  const router = useRouter()
  const handleButton = () => {
    router.push('/login')
  }
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button color="primary" variant="solid" onPress={handleButton}>
        Solid
      </Button>
      <Button color="primary" variant="faded" onPress={handleButton}>
        Faded
      </Button>
      <Button color="primary" variant="bordered" onPress={handleButton}>
        Bordered
      </Button>
      <Button color="primary" variant="light" onPress={handleButton}>
        Light
      </Button>
      <Button color="primary" variant="flat" onPress={handleButton}>
        Flat
      </Button>
      <Button color="primary" variant="ghost" onPress={handleButton}>
        Ghost
      </Button>
      <Button color="primary" variant="shadow" onPress={handleButton}>
        Shadow
      </Button>
    </div>)
}
