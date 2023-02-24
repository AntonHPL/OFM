import { useState, useEffect, FC, FormEvent, ReactElement } from 'react';
import axios from "axios";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormHelperText,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { errorFound, resetErrors } from "../functions/functions";
import SuccessDialog from './SuccessDialog';
import {
  DataCategoryInterface,
  DataRegionInterface,
  CategoryInterface,
  ErrorInterface,
  NewAdFormPropsInterface,
  RegionInterface,
  TitleInterface
} from '../types';
import { useTranslation } from 'react-i18next';
import i18next from "i18next";
import '../i18n';

const NewAdForm: FC<NewAdFormPropsInterface> = ({
  ad,
  adIsCreated,
  creationDate,
  setAd,
  setCreationDate,
  mainPictureId,
  emptyAd,
  setImages,
  imagesBeingUploaded,
  setImagesBeingUploaded
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Array<CategoryInterface> | null>(null);
  const [regions, setRegions] = useState<Array<RegionInterface> | null>(null);
  const [priceInputDisabled, setPriceInputDisabled] = useState(false);
  const [errors, setErrors] = useState<Array<ErrorInterface>>([]);
  const [adUploading, setAdUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [currentLang, setCurrentLang] = useState(i18next.language);

  i18next.on("languageChanged", () => setCurrentLang(i18next.language));

  useEffect(() => {
    if (isDialogOpen) {
      setAd(emptyAd);
      setImages(null);
    }
  }, [isDialogOpen]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const EF = (field: string): ErrorInterface | undefined => errorFound(errors, field);
  const RE = (field: string): void => resetErrors(errors, field, setErrors);

  const closeDialog = (): void => setIsDialogOpen(false);

  const typography = (value: string) => (
    <Typography variant="h5">
      {value}
    </Typography>
  );

  const disabledField = (type: string, label: string, value: string): ReactElement => (
    <TextField
      type={type}
      label={label}
      variant="outlined"
      value={value}
      disabled
      className="form-row"
    />
  );

  const menuItem = (e: { value: string, label: string }): ReactElement => (
    <MenuItem
      key={e.value}
      value={e.value}
    >
      {e.label}
    </MenuItem>
  );

  useEffect(() => {
    axios
      .get("/api/menu")
      .then(({ data }) => setCategoriesData(data))
      .catch(error => console.error("The error occured: ", error.message));
    axios
      .get("/api/regions")
      .then(({ data }) => {
        setRegions(data.map((e: DataRegionInterface): RegionInterface => {
          return ({
            value: e.state,
            label: e.state,
            cities: e.cities.map(el => {
              return ({
                value: el,
                label: el,
              });
            }),
          });
        }));
      })
      .catch(error => console.error("The error occured: ", error.message));
  }, []);

  useEffect(() => {
    setCategories(categoriesData.map((e: DataCategoryInterface): CategoryInterface => {
      return ({
        value: e.title[currentLang as keyof TitleInterface],
        label: e.title[currentLang as keyof TitleInterface],
        subCategories: e.contents[currentLang as keyof TitleInterface].map(el => {
          return ({
            value: el,
            label: el,
          });
        }),
      });
    }));
  }, [categoriesData, currentLang]);

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const errorsData: Array<ErrorInterface> = [];
    let errorText: string;
    Object.entries(ad).map(([key, value]) => {
      const push = () => errorsData.push({ field: key, errorText: errorText });
      if (key === "price") {
        if (priceInputDisabled) return;
        if (value === "") {
          errorText = t("newAdForm.thePriceFieldIsEmpty");
          push();
        } else if (value <= 0) {
          errorText = t("newAdForm.theMinimumPriceIs001USD");
          push();
        };
      };
      if (key !== "price" && !value) {
        switch (key) {
          case "title": errorText = t("newAdForm.theTitleFieldIsEmpty"); break;
          case "category": errorText = t("newAdForm.theCategoryIsNotChosen"); break;
          case "subCategory": errorText = t("newAdForm.theSubCategoryIsNotChosen"); break;
          case "description": errorText = t("newAdForm.theDescriptionFieldIsEmpty"); break;
          case "region": errorText = t("newAdForm.theRegionIsNotChosen"); break;
          case "city": errorText = t("newAdForm.theCityIsNotChosen"); break;
        };
        push();
      };
    });
    setErrors(errorsData);
    if (!errorsData.length) {
      setAdUploading(true);
      if (adIsCreated) {
        axios
          .put(`/api/ad/${creationDate}`, { ad, mainPictureId })
          .then(() => {
            setAdUploading(false);
            setIsDialogOpen(true);
          })
          .catch(error => {
            console.error("The error occured: ", error.message);
            setAdUploading(false)
          })
      } else {
        const currentTime = new Date().toISOString();
        axios
          .post("/api/ad", { creationDate: currentTime, ad })
          .then(() => {
            setAdUploading(false);
            setIsDialogOpen(true);
          })
          .catch(error => {
            console.error("The error occured: ", error.message);
            setAdUploading(false);
          });
      };
      setCreationDate(new Date().toISOString());
    };
    setImagesBeingUploaded(0);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="new-ad-form"
      >
        {typography("General Info")}
        <TextField
          autoComplete="off"
          error={!!EF("title")}
          label={t("newAdForm.productTitle")}
          value={ad.title}
          variant="outlined"
          helperText={`${EF("title")?.errorText || ""} ${t("newAdForm.exampleDeliciosMilk")}`}
          onChange={e => {
            setAd({ ...ad, title: e.target.value });
            RE("title");
          }}
          className="form-row"
        />
        <div className="complex-form-row">
          <FormControl
            error={!!EF("category")}
            sx={{ m: 1, minWidth: 120 }}
            className={ad.category ? "half-width-field" : "full-width-field"}
          >
            <InputLabel id="categories-select">
              {t("newAdForm.category")}
            </InputLabel>
            <Select
              labelId="categories-select"
              label={t("newAdForm.category")}
              value={ad.category}
              onChange={e => {
                setAd({ ...ad, category: e.target.value });
                RE("category");
              }}
              MenuProps={MenuProps}
            >
              {categories?.map(e => menuItem(e))}
            </Select>
            <FormHelperText>
              {EF("category")?.errorText || ""} {t("newAdForm.exampleDairyProducts")}
            </FormHelperText>
          </FormControl>
          {ad.category &&
            <FormControl
              error={!!EF("subCategory")}
              className="half-width-field"
            >
              <InputLabel id="subCategories-select">
                {t("newAdForm.subCategory")}
              </InputLabel>
              <Select
                labelId="subCategories-select"
                label={t("newAdForm.subCategory")}
                value={ad.subCategory}
                onChange={e => {
                  setAd({ ...ad, subCategory: e.target.value });
                  RE("subCategory");
                }}
                MenuProps={MenuProps}
              >
                {categories?.find(e => e.value === ad.category)?.subCategories.map(e => menuItem(e))}
              </Select>
              <FormHelperText>
                {EF("subCategory")?.errorText || ""} {t("newAdForm.exampleMilk&Cream")}
              </FormHelperText>
            </FormControl>
          }
        </div>
        <TextField
          autoComplete="off"
          error={!!EF("description")}
          multiline
          rows={4}
          label={t("newAdForm.description")}
          value={ad.description}
          onChange={e => {
            setAd({ ...ad, description: e.target.value });
            RE("description");
          }}
          helperText={`${EF("description")?.errorText || ""} ${t("newAdForm.exampleFreshMilkFromOldMcDonaldsFarm")}`}
          className="form-row"
        />
        <div className="price-block">
          <TextField
            inputProps={{ min: 0 }}
            autoComplete="off"
            error={priceInputDisabled ? false : !!EF("price")}
            label={t("newAdForm.priceUSD")}
            value={ad.price}
            type="number"
            helperText={`${EF("price")?.errorText || ""} ${t("newAdForm.example10")}`}
            disabled={priceInputDisabled}
            onChange={e => {
              setAd({ ...ad, price: +e.target.value });
              RE("price");
            }}
            className="price-field"
          />
          <FormControlLabel
            control={<Switch />}
            onChange={() => {
              setPriceInputDisabled(!priceInputDisabled);
              setAd({ ...ad, price: "" });
              RE("price");
            }}
            label={t("newAdForm.forFree")}
            className="price-label" />
        </div>
        {typography("Product's Location")}
        <div className="complex-form-row">
          <FormControl
            error={!!EF("region")}
            className={ad.region ? "half-width-field" : "full-width-field"}
          >
            <InputLabel id="regions-select">
              {t("newAdForm.region")}
            </InputLabel>
            <Select
              labelId="regions-select"
              label={t("newAdForm.region")}
              value={ad.region}
              onChange={e => {
                setAd({ ...ad, region: e.target.value });
                RE("region");
              }}
              MenuProps={MenuProps}
            >
              {regions?.map(e => menuItem(e))}
            </Select>
            <FormHelperText>
              {EF("region")?.errorText || ""} {t("newAdForm.exampleIndiana")}
            </FormHelperText>
          </FormControl>
          {ad.region &&
            <FormControl
              error={!!EF("city")}
              className="half-width-field"
            >
              <InputLabel id="cities-select">
                {t("newAdForm.city")}
              </InputLabel>
              <Select
                labelId="cities-select"
                label={t("newAdForm.city")}
                value={ad.city}
                onChange={e => {
                  setAd({ ...ad, city: e.target.value });
                  RE("city");
                }}
                MenuProps={MenuProps}
              >
                {regions?.find(e => e.value === ad.region)?.cities.map(e => menuItem(e))}
              </Select>
              <FormHelperText>
                {EF("city")?.errorText || ""} {t("newAdForm.exampleIndianopolis")}
              </FormHelperText>
            </FormControl>
          }
        </div>
        {typography("Seller's Contacts")}
        {disabledField("text", t("newAdForm.name"), ad.sellerName)}
        {disabledField("email", t("newAdForm.email"), ad.sellerEmail)}
        <Button
          type="submit"
          startIcon={<SaveIcon />}
          variant="contained"
          disabled={!!imagesBeingUploaded}
        >
          {t("newAdForm.save&Place")}
        </Button>
      </form>
      <SuccessDialog open={isDialogOpen} closeDialog={closeDialog} />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={adUploading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default NewAdForm;