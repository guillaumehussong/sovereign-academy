import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import { trpc } from '@sovereign-academy/api-client';

import { RessourceLayout } from '../../components/RessourceLayout';

export const Podcasts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: podcasts } = trpc.content.getPodcasts.useQuery({
    language: 'en',
  });

  return (
    <RessourceLayout
      title="The Podcast Portal"
      tagLine="This PORTAL is open-source & open to contribution. Thanks for grading and sharing !"
      filterBar={{
        onChange: setSearchTerm,
        label: 'Find the perfect resources for your needs:',
      }}
    >
      <div className="grid grid-cols-2 my-20 gap-x-8 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {podcasts
          ?.filter(({ name }) => name.includes(searchTerm))
          .map((podcast) => (
            <Popover key={podcast.logo} className="relative">
              <Popover.Button>
                <div
                  className="cursor-pointer max-h-64 group"
                  key={podcast.logo}
                >
                  <img
                    className="h-full mx-auto duration-200 border-2 border-transparent border-solid rounded-none group-hover:rounded-3xl group-hover:border-secondary-400"
                    src={podcast.logo}
                    alt={podcast.name}
                  />
                </div>
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 bg-primary-100">
                  <div className="flex flex-col p-2 w-52 bg-secondary-400">
                    <img
                      className="h-full mx-auto duration-200 border-2 border-transparent border-solid rounded-none group-hover:rounded-3xl group-hover:border-secondary-400"
                      src={podcast.logo}
                      alt={podcast.name}
                    />

                    <h4 className="text-xs">{podcast.name}</h4>
                    <h5 className="italic text-xxs">{podcast.host}</h5>
                    <h5 className="italic text-xxs">
                      {podcast.tags.join(', ')}
                    </h5>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          ))}
      </div>
    </RessourceLayout>
  );
};