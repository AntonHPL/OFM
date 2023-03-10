import axios from 'axios';
import { useEffect, useState, useContext, FC } from 'react';
import { UserContext } from "./UserContext";
import { Paper, Typography } from '@mui/material';
import { EmptyAdInterface, ImageInterface } from '../types';
import ImagesCard from './ImagesCard';
import NewAdForm from './NewAdForm';
import { useTranslation } from 'react-i18next';
import '../i18n';

const NewAd: FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const emptyAd: EmptyAdInterface = {
    title: "",
    category: "",
    subCategory: "",
    description: "",
    region: "",
    price: "",
    city: "",
    sellerName: user?.name || "",
    sellerEmail: user?.email || "",
    sellerId: user?._id || "",
  };

  const [images, setImages] = useState<Array<ImageInterface> | null>(null);
  const [ad, setAd] = useState<EmptyAdInterface>(emptyAd);
  const [creationDate, setCreationDate] = useState(new Date().toISOString());
  const [adIsCreated, setAdIsCreated] = useState(false);
  const [mainPictureId, setMainPictureId] = useState("");
  const [imagesBeingUploaded, setImagesBeingUploaded] = useState(0);
  // console.log(`
  //   The ads posted on the Flea Market are to be written in English only and contain:
  //     – the ad title and the specific product(s) description. The description is to be complete and reliable, should not contain the contact details of the seller and links to the third-party resources. It is not allowed to advertise dissimilar products in one ad. The ad title should not contain prices, links to the third-party resources and any contact information;
  //     – the reliable price of the product(s). At the same time, it is to be indicated in USD in the “Price” field;
  //     – the reliable information about the seller;
  //     – the reliable information about the product(s) condition;
  //     –  the reliable contact information that includes the e-mail. The e-mail is indicated in a special field while registering a profile. It is not allowed to indicate the e-mail in the ad text.
  //   `);

  const deleteUnsavedAd = (): void => {
    axios.delete(`/api/unsaved_item/${creationDate}`);
  };

  useEffect(() => {
    return deleteUnsavedAd;
  }, []);

  useEffect(() => {
    setAd({ ...ad, subCategory: null });
  }, [ad.category]);

  window.onbeforeunload = (): undefined => {
    deleteUnsavedAd();
    return undefined;
  };

  return (
    <Paper className="new-ad-container" sx={{ backgroundColor: "secondary.light" }}>
      <Typography variant="h4">
        {t("newAd.createANewAd")}
      </Typography>
      <ImagesCard
        adIsCreated={adIsCreated}
        images={images}
        setImages={setImages}
        setAdIsCreated={setAdIsCreated}
        creationDate={creationDate}
        mainPictureId={mainPictureId}
        setMainPictureId={setMainPictureId}
        imagesBeingUploaded={imagesBeingUploaded}
        setImagesBeingUploaded={setImagesBeingUploaded}
      />
      <NewAdForm
        ad={ad}
        adIsCreated={adIsCreated}
        setAd={setAd}
        setImages={setImages}
        creationDate={creationDate}
        setCreationDate={setCreationDate}
        mainPictureId={mainPictureId}
        emptyAd={emptyAd}
        imagesBeingUploaded={imagesBeingUploaded}
        setImagesBeingUploaded={setImagesBeingUploaded}
      />
      {/* <Card className="info-card" sx={{ backgroundColor: "secondary.light" }}>
        <CardActions>
          Attention!
        </CardActions>
        <CardContent>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            {text}
          </Typography>
        </CardContent>
      </Card> */}
    </Paper>
  );
};

export default NewAd;