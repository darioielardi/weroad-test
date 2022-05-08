import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Travel } from '../../src/travels/entities/travel.entity';

export class ToursSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Travel, {
      slug: 'jordan-360',
      name: 'Jordan 360°',
      description:
        'Jordan 360°: the perfect tour to discover the suggestive Wadi Rum desert, the ancient beauty of Petra, and much more.\n\nVisiting Jordan is one of the most fascinating things that everyone has to do once in their life.You are probably wondering "Why?". Well, that\'s easy: because this country keeps several passions! During our tour in Jordan, you can range from well-preserved archaeological masterpieces to trekkings, from natural wonders excursions to ancient historical sites, from camels trek in the desert to some time to relax.\nDo not forget to float in the Dead Sea and enjoy mineral-rich mud baths, it\'s one of the most peculiar attractions. It will be a tour like no other: this beautiful country leaves a memorable impression on everyone.',
      numberOfDays: 8,
      natureMood: 80,
      relaxMood: 20,
      historyMood: 90,
      cultureMood: 30,
      partyMood: 10,
      tours: [
        {
          name: 'ITJOR20211101',
          startingDate: new Date('2021-11-01'),
          endingDate: new Date('2021-11-09'),
          price: 199900,
        },
        {
          name: 'ITJOR20211112',
          startingDate: new Date('2021-11-12'),
          endingDate: new Date('2021-11-20'),
          price: 189900,
        },
        {
          name: 'ITJOR20211125',
          startingDate: new Date('2021-11-25'),
          endingDate: new Date('2021-12-03'),
          price: 214900,
        },
      ],
    });

    em.create(Travel, {
      isPublic: true,
      slug: 'iceland-hunting-northern-lights',
      name: 'Iceland: hunting for the Northern Lights',
      description:
        "Why visit Iceland in winter? Because it is between October and March that this land offers the spectacle of the Northern Lights, one of the most incredible and magical natural phenomena in the world, visible only near the earth's two magnetic poles. Come with us on WeRoad to explore this land of ice and fire, full of contrasts and natural variety, where the energy of waterfalls and geysers meets the peace of the fjords... And when the ribbons of light of the aurora borealis twinkle in the sky before our enchanted eyes, we will know that we have found what we were looking for.",
      numberOfDays: 8,
      natureMood: 100,
      relaxMood: 30,
      historyMood: 10,
      cultureMood: 20,
      partyMood: 10,
      tours: [
        {
          name: 'ITICE20211101',
          startingDate: new Date('2021-11-01'),
          endingDate: new Date('2021-11-08'),
          price: 199900,
        },
      ],
    });

    em.create(Travel, {
      isPublic: true,
      slug: 'united-arab-emirates',
      name: 'United Arab Emirates: from Dubai to Abu Dhabi',
      description:
        'At Dubai and Abu Dhabi everything is huge and majestic: here futuristic engineering works and modern infrastructures meet historical districts, local souks (typical bazars), desert and the sea. In this tour we’ll discover Dubai, where we’ll get on top of the highest skyscraper ever built, the Burj Khalifa. We’ll then take a walk at the Dubai Mall, the biggest mall on the planet, and we’ll spend a night in the desert, with the sight of the skyline on the horizon keeping us company. Then, it will be Abu Dhabi’s tourn! Sheik Zayed’s Grand Mosque’s white marble awaits for us to remain stoked in front of its wonderfulness, and the sea will invade us with peacefulness. UAE are all to discover, we’ll just get a taste of it, but we guarantee you’ll get quite the idea!',
      numberOfDays: 7,
      natureMood: 30,
      relaxMood: 40,
      historyMood: 20,
      cultureMood: 80,
      partyMood: 70,
      tours: [
        {
          name: 'ITARA20211221',
          startingDate: new Date('2021-12-21'),
          endingDate: new Date('2021-12-28'),
          price: 189900,
        },
        {
          name: 'ITARA20220103',
          startingDate: new Date('2022-01-03'),
          endingDate: new Date('2022-01-10'),
          price: 149900,
        },
      ],
    });
  }
}
