import bild2 from "../assets/Bild2.jpg";
import bild3 from "../assets/Bild3.jpg";
import { DirectionsMarkup, GiftMarkup, OSAMarkup } from "../assets/Texts";
import { Image } from "../components/Image";

import { HotelMarkup } from "../assets/Texts";
import { MapComponent } from "../components/Map";
import { SectionContainer } from "../components/SectionContainer";
import { Heading } from "../components/Heading";
import { HeadingEnum } from "../types/enums";
import OsaForm from "../components/OsaForm";
import { SongSuggestion } from "../components/SongSuggestion";
export const WeddingPage = () => {
  return (
    <>
      <Heading type={HeadingEnum.section} id="wedding">
        Bröllopet
      </Heading>
      <div className="sm:w-2/3 self-center mb-8">
        <Image imageSource={bild2} altText="couple by the lake" />
      </div>
      <SectionContainer>
        <Heading type={HeadingEnum.subSection} id="osa">
          OSA
        </Heading>
        <OSAMarkup />
        <OsaForm />
      </SectionContainer>
      <SectionContainer>
        <Heading type={HeadingEnum.subSection} id="hotel">
          Hotell
        </Heading>
        <HotelMarkup />
        <Image imageSource={bild3} altText="hotel" />
      </SectionContainer>
      <SectionContainer>
        <Heading type={HeadingEnum.subSection} id="map">
          Hitta hit
        </Heading>
        <DirectionsMarkup />
        <MapComponent />
      </SectionContainer>
      <SectionContainer>
        <Heading type={HeadingEnum.subSection} id="song-suggestions">
          Låtförslag
        </Heading>
        <SongSuggestion />
      </SectionContainer>
      <SectionContainer>
        <Heading type={HeadingEnum.subSection} id="gifts">
          Gåvor
        </Heading>
        <GiftMarkup />
      </SectionContainer>
    </>
  );
};
