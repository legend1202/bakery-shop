import { LightboxExternalProps } from "yet-another-react-lightbox";

// ----------------------------------------------------------------------

export interface LightBoxProps extends LightboxExternalProps {
  disabledZoom?: boolean | any;
  disabledVideo?: boolean | any;
  disabledTotal?: boolean | any;
  disabledCaptions?: boolean | any;
  disabledSlideshow?: boolean | any;
  disabledThumbnails?: boolean | any;
  disabledFullscreen?: boolean | any;
  onGetCurrentIndex?: (index: number | any) => void;
}
