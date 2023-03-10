import { useState, useEffect, FC, ReactElement } from 'react';
import axios from "axios";
import { IconButton, Paper, Skeleton, Typography } from "@mui/material";
import { AccountCircle, Delete, NoPhotography } from "@mui/icons-material";
import { BriefAdInterface, ChatDeletionDialogInterface, ChatInterface, InterlocutorsPropsInterface, LastMessageInterface, ModifiedChatInterface, SellerInterface } from '../types';
import ChatDeletionDialog from "./ChatDeletionDialog";
import { useTranslation } from 'react-i18next';
import '../i18n';

const Interlocutors: FC<InterlocutorsPropsInterface> = ({
	myId,
	chats,
	setChats,
	newMessage,
	setNewMessage,
	chatId,
	setChatId,
	setOldMessages,
	setIsChatChosen,
	setLoading,
}) => {
	const { t } = useTranslation();
	const [chatsData, setChatsData] = useState<Array<ChatInterface> | null>(null);
	const [dialog, setDialog] = useState<ChatDeletionDialogInterface>({ open: false, chatId: "" });
	const [lastMessages, setLastMessages] = useState<Array<LastMessageInterface>>([]);

	useEffect(() => {
		if (chatsData) {
			const modifiedChatsData: Array<ModifiedChatInterface> = chatsData.map(chatData => {
				return {
					...chatData,
					myInterlocutor: chatData.participants.find(participant => participant?.id !== myId) || null,
				}
			});
			axios
				.get("/api/items-briefly", {
					params: { adsIds: JSON.stringify(modifiedChatsData.map(el => el.adId)) }
				})
				.then(({ data }) => {
					modifiedChatsData.map((chat, i) => {
						data.map((ad: BriefAdInterface): void => {
							if (chat.adId === ad._id) {
								modifiedChatsData[i] = {
									...chat,
									adImage: ad.images[0]?.data || undefined,
									adTitle: ad.textInfo.title
								};
							};
						});
					});
					return axios.get("/api/sellers", {
						params: {
							sellersIds: JSON.stringify(
								modifiedChatsData.map(el =>
									el.myInterlocutor?.id
								))
						}
					})
				})
				.then(({ data }) => {
					modifiedChatsData.map((chat, i) => {
						data.map((seller: SellerInterface) => {
							if (chat.myInterlocutor?.id === seller._id) {
								modifiedChatsData[i] = {
									...chat,
									sellerImage: seller.image?.data || undefined,
								};
							};
						});
					});
					setChats(modifiedChatsData);
				})
				.catch(error => console.error("The error occured: ", error.message));
		};
	}, [chatsData]);

	useEffect(() => {
		newMessage &&
			setLastMessages(prev => [
				...prev.filter(el => el.chatId !== chatId), {
					chatId: chatId,
					message: newMessage,
				}])
	}, [newMessage]);

	useEffect(() => {
		const adIdSelected = localStorage.getItem("ad-id_selected")
		adIdSelected && chats && revealHistory(adIdSelected);
	}, [chats]);

	useEffect(() => {
		getChatsData();
	}, [myId]);

	const getChatsData = (): void => {
		myId &&
			axios
				.get(`/api/chats-briefly/${myId}`)
				.then(({ data }) => {
					if (data.length) {
						setChatsData(data);
					} else {
						// allMessages.length && setAllMessages([]);
						setChats([]);
					}
				})
				.catch(error => console.error("The error occured: ", error.message));
	};

	const closeDialog = () => {
		setIsChatChosen(false);
		setChatId("");
		setDialog({ open: false, chatId: "" });
	};

	const revealHistory = (el: string): void => {
		const relatedChat = chats?.find(chat => chat.adId === el);
		setNewMessage(null);
		// setOldMessages(relatedChat?.messages || null);
		setChatId(relatedChat?._id || "");
		setIsChatChosen(true);
	};

	useEffect(() => {
		if (chatId) {
			setLoading(true);
			axios
				.get(`/api/chat/${chatId}`)
				.then(({ data }) => {
					setOldMessages(data.messages);
				})
				.catch(error => {
					console.error("The error occured: ", error.message);
					setLoading(false);
				})
		}

	}, [chatId]);

	const skeletons = (): Array<ReactElement> => {
		const content = [];
		for (let i = 0; i < 3; i++) {
			content.push(
				<Skeleton variant="rectangular" className="skeleton" />
			)
		};
		return content;
	};

	return (
		<>
			{!(chats && !chats.length) &&
				<div className="interlocutors">
					{chats ?
						chats.map(chat => {
							const lastMessage = chat.messages[0];
							const messageFound = lastMessages.find(el => el.chatId === chat._id);
							return (
								<Paper
									className={`interlocutor ${chatId === chat._id ? "selected" : ""}`}
									sx={{ "&:hover": { backgroundColor: "primary.dark" }, backgroundColor: chatId === chat._id ? "primary.light" : "", }}
									onClick={() => revealHistory(chat.adId)}
								>
									<div className="images">
										{chat.adImage ?
											<Paper className="ad-image" sx={{ border: "1px solid primary.light" }}>
												<img src={`data:image/png;base64,${chat.adImage}`} />
											</Paper> :
											<NoPhotography className="no-photography" />
										}
										{chat.sellerImage ?
											<Paper className="seller-image" sx={{ border: "1px solid primary.light" }}>
												<img src={`data:image/png;base64,${chat.sellerImage}`} />
											</Paper> :
											<Paper className="account-circle-container" sx={{ border: "1px solid primary.main" }}>
												<AccountCircle viewBox="2 2 20 20" className="account-circle" />
											</Paper>
										}
									</div>
									<div className="sender-info">
										<Typography variant="h6">
											{chat.myInterlocutor?.name}
										</Typography>
										<Typography variant="h6">
											{chat.adTitle || t("interlocutors.deletedAd")}
										</Typography>
										<>
											{messageFound ? (
												messageFound.message.senderId === myId ? `${t("interlocutors.you")} ${messageFound.message.message}` : messageFound.message.message
											) : (
												lastMessage.senderId === myId ? `${t("interlocutors.you")} ${lastMessage.message}` : lastMessage.message
											)}
										</>
									</div>
									<IconButton
										aria-label="delete"
										className="delete-button"
										onClick={() => setDialog({ open: true, chatId: chat._id })}
									>
										<Delete />
									</IconButton>
								</Paper>
							);
						}) :
						skeletons()
					}
					<ChatDeletionDialog dialog={dialog} closeDialog={closeDialog} getChatsData={getChatsData} />
				</div>
			}
		</>
	);
};

export default Interlocutors;