import { useState, useEffect, FC, MouseEvent } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { MenuPropsInterface, DataMenuInterface, MenuInterface, TitleInterface } from '../types';
import { useTranslation } from 'react-i18next';
import i18next from "i18next";
import '../i18n';

const Menu: FC<MenuPropsInterface> = ({ getAdsProps, setSubString, setCategory, setSubCategory }) => {
  const [stableItems, setStableItems] = useState<Array<MenuInterface>>([]);
  const [listItems, setListItems] = useState<Array<MenuInterface>>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18next.language);
  const [itemsData, setItemsData] = useState<Array<DataMenuInterface>>([]);

  const { subString, category, subCategory } = getAdsProps.functionProps;

  i18next.on("languageChanged", () => setCurrentLang(i18next.language));

  useEffect(() => {
    setMenuLoading(true);
    axios
      .get("/api/menu")
      .then(({ data }) => {
        setItemsData(data);
      })
      .catch(error => console.error("The error occured: ", error.message));
  }, []);

  useEffect(() => {
    const items = itemsData.map((e: DataMenuInterface): MenuInterface => {
      return {
        ...e,
        title: e.title[currentLang as keyof TitleInterface],
        contents: e.contents[currentLang as keyof TitleInterface].map(el => {
          return {
            text: el,
            selected: false,
          };
        }),
        open: false,
        selected: false,
      };
    });
    setListItems(items);
    setStableItems(items);
    setMenuLoading(false);
  }, [currentLang, itemsData]);

  const onItemClick = (e: MouseEvent<HTMLDivElement>) => {
    subCategory && setSubCategory("");
    const target = e.target as HTMLDivElement;
    const innerText = target.innerText;
    setListItems(stableItems.map(stableItem => {
      const condition = stableItem.title === innerText;
      return {
        ...stableItem,
        open: condition ? true : false,
        selected: condition ? true : false,
      };
    }));
    subString !== "" && setSubString("");
    setCategory(innerText);
  }

  const onSubItemClick = (e: MouseEvent<HTMLDivElement>) => {
    category && setCategory("");
    const target = e.target as HTMLDivElement;
    const innerText = target.innerText;
    setListItems(
      stableItems.map(stableItem => {
        return {
          ...stableItem,
          open: stableItem.contents
            .map(el => el.text)
            .includes(innerText) && true,
          contents: stableItem.contents
            .map(stableSubItem => {
              return {
                ...stableSubItem,
                selected: stableSubItem.text === innerText && true,
              };
            }),
        };
      })
    );
    setSubCategory(innerText);
  }

  return (
    <div className="menu-container">
      {menuLoading ?
        <Skeleton
          variant="rectangular"
          className="skeleton"
        /> :
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "inherit" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {listItems.map(li => {
            return (
              <>
                <ListItemButton
                  onClick={e => onItemClick(e)}
                  selected={li.selected}
                >
                  <ListItemText primary={li.title} />
                  {li.contents.length > 0 && (li.open ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={li.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {li.contents.map(subItem => {
                      return (
                        <ListItemButton
                          sx={{ pl: 4 }}
                          onClick={e => onSubItemClick(e)}
                          selected={subItem.selected}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </>
            );
          })}
        </List>
      }
    </div>
  );
};

export default Menu;
