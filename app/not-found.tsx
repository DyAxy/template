"use server"

import config from "@/config";
import { Button, Link } from "@nextui-org/react";
import { AbstractIntlMessages } from "next-intl";
import { getLocale, getMessages } from 'next-intl/server';

export default async function NotFound() {
  const messages: AbstractIntlMessages = (await getMessages({ locale: await getLocale() })).NotFound as AbstractIntlMessages

  return (
    <main className="relative isolate h-screen"
      style={{
        backgroundImage: `url("${config.appWallpaper}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-lg font-semibold leading-8 text-content1">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-content1 sm:text-7xl">{messages.title as string}</h1>
        <p className="mt-4 text-xl text-content1/70 sm:mt-6">{messages.desc as string}</p>

        <div className="mt-10 flex justify-center">
          <Link href='/' underline="hover" className="text-xl font-semibold leading-7" color="primary">
            {messages.back as string}
          </Link>
        </div>
      </div>
    </main>
  )
}
