import { useState, useEffect, useContext, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import { AdInterface, SellerInterface } from "../types";
import FirstMessageDialog from "./FirstMessageDialog";
import ImageSlider from "./ImageSlider";
import { Backdrop, Button, Typography, Skeleton, Link, Paper, Alert, CircularProgress } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import '../i18n';

const Ad = () => {
  const { t }: { t: (value: string) => string } = useTranslation();
  const params = useParams();
  const { user } = useContext(UserContext);
  const paramsId: string = params.id || "";
  const navigate = useNavigate();
  const [ad, setAd] = useState<AdInterface | null>(null);

  const [messageText, setMessageText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [deletion, setDeletion] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/ad/${paramsId}`)
      .then(({ data }) => setAd(data))
      .catch(error => console.error("The error occured: ", error.message));
  }, []);

  useEffect(() => {
    ad &&
      axios
        .get(`/api/seller/${ad.textInfo.sellerId}`)
        .then(({ data }) => setSeller(data[0]))
        .catch(error => console.error("The error occured: ", error.message));
  }, [ad]);

  const isAdMine = user?._id === ad?.textInfo.sellerId;

  const startConversation = (textReceived?: string): void => {
    ad &&
      axios
        .get(`/api/chat-existence/${ad._id}`)
        .then(({ data }) => {
          if (data) {
            navigate("/profile/chats");
            localStorage.setItem("outletTitle", "My Chats");
            localStorage.setItem("ad-id_selected", ad._id);
            textReceived && localStorage.setItem("message-text", textReceived);
          } else {
            setIsDialogOpen(true);
            textReceived && setMessageText(textReceived);
          }
        })
        .catch(error => console.error("The error occured: ", error.message));
  };

  const deleteAd = () => {
    setDeletion(true);
    axios
      .delete(`/api/ad/${ad?.creationDate}`)
      .then(() => {
        setDeletion(false);
        navigate("/profile/ads");
        localStorage.setItem("outletTitle", "My Ads");
      })
      .catch(error => {
        setDeletion(false);
        console.error("The error occured: ", error.message)
      })
  };

  const closeDialog = (): void => {
    setIsDialogOpen(false);
    messageText && setMessageText("");
  };

  const writeToTheSellerButton = (): ReactElement => {
    return (
      <Button
        disabled={!user}
        variant="contained"
        onClick={() => startConversation()}
        className="write-to-the-seller-button"
      >
        {t("ad.writeToTheSeller")}
      </Button>
    )
  };

  const quickMessageButtons = (messages: Array<string>): Array<ReactElement> => {
    return messages.map(el => (
      <Button
        variant="outlined"
        disabled={!user}
        onClick={() => startConversation(el)}
      >
        {el}
      </Button>
    ));
  };

  const skeleton = (extraClass: string): ReactElement => {
    return (
      <Skeleton
        variant="rectangular"
        className={`skeleton-${extraClass}`}
      />
    )
  };

  return (
    <div className="ad-container">
      <ImageSlider ad={ad} />
      <div className="aside">
        {ad ?
          <Paper sx={{ backgroundColor: "secondary.light" }}>
            <Typography variant="h5">
              {ad.textInfo.price ? `$${ad.textInfo.price}` : t("ad.forFree")}
            </Typography>
            <Typography variant="h5">
              {ad.textInfo.title}
            </Typography>
            <br />
            <Typography variant="body2">
              {t("ad.locatedIn")} {ad.textInfo.region}, {ad.textInfo.city}.
            </Typography>
            <Typography variant="body2">
              {t("ad.createdOn")}&nbsp;
              {ad.creationDate &&
                new Date(ad.creationDate).toLocaleDateString(t("ad.locales"), {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}.
            </Typography>
          </Paper> :
          skeleton("aside-top")
        }
        {seller ?
          <Paper sx={{ backgroundColor: "secondary.light" }}>
            <Typography variant="h6">
              {t("ad.aboutSeller")}
            </Typography>
            <div className="seller-info">
              <div className="account">
                <div className="image">
                  {seller.image ?
                    <img src={`data:image/png;base64,${seller.image.data}`} /> :
                    <AccountCircle />
                  }
                </div>
                <Typography variant="body1">
                  {seller.name}
                </Typography>
              </div>
              <Typography variant="body2">
                {t("ad.onOnlineFarmersMarketSince")} {
                  new Date(seller.registrationDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })
                }.
              </Typography>
              {!isAdMine && writeToTheSellerButton()}
            </div>
          </Paper> :
          skeleton("aside-bottom")
        }
        {isAdMine &&
          <Alert severity="info" className="alert" sx={{ backgroundColor: "secondary.light" }}>
            {t("ad.thatIsYourAdYouCan")}&nbsp;
            <Link color="error" underline="hover" onClick={deleteAd}>
              {t("ad.deleteIt")}
            </Link> {t("ad.anyTime")}
          </Alert>
        }
      </div>
      {ad ?
        <Paper className="description" sx={{ backgroundColor: "secondary.light" }}>
          <Typography variant="h6">
            {t("ad.description")}
          </Typography>
          <Typography variant="body1">
            {ad?.textInfo.description}
          </Typography>
        </Paper> :
        skeleton("description")
      }
      {!isAdMine && (
        seller ?
          <Paper className="questions" sx={{ backgroundColor: "secondary.light" }}>
            <Typography variant="h6">
              {t("ad.interested")}
            </Typography>
            <Typography variant="body1">
              {t("ad.askTheSellerOneOfTheQuestionsProposed")}
            </Typography>
            {quickMessageButtons([t("ad.notSoldYet"), t("ad.howToPickUpTheGoods"), t("ad.isThePriceNegotiable")])}
            <Typography variant="body1">
              {t("ad.orWriteYourOwn")}
            </Typography>
            {writeToTheSellerButton()}
          </Paper> :
          skeleton("questions")
      )}
      <FirstMessageDialog
        open={isDialogOpen}
        closeDialog={closeDialog}
        seller={seller}
        messageText={messageText}
        setMessageText={setMessageText}
        ad={ad}
        paramsId={paramsId}
      />
      <Backdrop open={deletion}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
};

export default Ad;