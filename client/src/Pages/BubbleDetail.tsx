import React, { useState, useEffect } from "react";
import "./Styles/BubbleDetail.css";
import "./Styles/Reset.css";
import axiosInstance from "../axios";
import { useHistory } from "react-router-dom";
import backIcon from "./Styles/back.png";
import trashcan from "./Styles/trashcan.png";
import Swal from "sweetalert2";
import Error404 from "./error404";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const BubbleDetail = (): JSX.Element => {
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const API_URL = process.env.REACT_APP_API_URL;
	const history = useHistory();
	console.log(userState);

	const [commentInput, setCommentInput] = useState("");
	const [bubbleComments, setBubbleComments] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

	const getBubbleId = (): string => {
		return window.location.pathname.split("/")[2];
	};
	const bubbleId = Number(getBubbleId());

	const [bubbleData, setBubbleData] = useState({
		id: "",
		image: "",
		sound: "",
		textContent: "",
		user: { email: "", nickname: "" },
	});
	const [isValid, setIsValid] = useState(false);

	const getBubbleData = async () => {
		await axiosInstance({
			method: "GET",
			url: `${API_URL}/bubble/${bubbleId}`,
			// withCredentials: true,
		})
			.then(res => {
				setIsValid(true);
				setBubbleData(res.data.data.bubble);
				setBubbleComments(res.data.data.comments);
			})
			.catch(err => {
				console.log(err.response);
				if (err.response && err.response.status === 404) {
					window.location.replace(`/error404`);
				}
			});
	};

	useEffect(() => {
		getBubbleData();
	}, []);

	const handleSubmitComment = async (text: string) => {
		if (userState.user.id >= 0) {
			await axiosInstance({
				method: "POST",
				url: `${API_URL}/bubble/${bubbleId}/comment`,
				data: { textContent: text },
				withCredentials: true,
			}).then(() => {
				setCommentInput("");
				getBubbleData();
			});
		}
	};

	const handleDeleteComment = async id => {
		Swal.fire({
			icon: "warning",
			text: "????????? ?????????????????????????",
			showCancelButton: true,
			cancelButtonColor: "#f17878",
			confirmButtonColor: "rgb(119, 112, 255)",
			confirmButtonText: "????????????",
			cancelButtonText: "?????????",
		}).then(result => {
			if (result.isConfirmed) {
				axiosInstance({
					method: "DELETE",
					url: `${API_URL}/bubble/${bubbleId}/comment`,
					data: { commentId: id },
					withCredentials: true,
				}).then(() => {
					getBubbleData();
				});
			}
		});
	};

	const handleDeleteBubble = async () => {
		Swal.fire({
			text: "????????? ?????????????????????????",
			icon: "warning",
			showCancelButton: true,
			cancelButtonColor: "#f17878",
			confirmButtonColor: "rgb(119, 112, 255)",
			confirmButtonText: "????????????",
			cancelButtonText: "?????????",
		}).then(result => {
			if (result.isConfirmed) {
				Swal.fire({
					icon: "success",
					text: "????????? ?????????????????????.",
				}).then(() => {
					axiosInstance({
						method: "DELETE",
						url: `${API_URL}/bubble/${bubbleId}`,
						withCredentials: true,
					}).then(() => {
						history.push("/palette");
					});
				});
			}
		});
	};
	const audio = new Audio(`${bubbleData.sound}`);

	const handleStopSound = () => {
		window.location.replace(`/bubble/${bubbleId}`);
	};
	const handlePlaySound = () => {
		audio.play();
		setIsPlaying(true);
	};
	const handleCommentClick = () => {
		if (userState.user.id === -1) {
			Swal.fire({
				text: "???????????? ???????????????. ????????? ???????????? ?????????????????????????",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "???????????????",
				cancelButtonText: "?????????",
			}).then(result => {
				if (result.isConfirmed) {
					window.location.replace("/login");
				}
			});
		}
	};

	return (
		<>
			{isValid ? (
				<div className="bubbleDetail-container">
					<div>
						{isPlaying ? null : (
							<div className="arrow_box">
								{" "}
								Click to <br />
								Play Sound !{" "}
							</div>
						)}
						<img
							src={backIcon}
							className="backIcon"
							alt="?????? ??????"
							onClick={() => window.location.replace("/palette")}
						/>
						{bubbleData.user.email === userState.user.email ? (
							<img src={trashcan} className="deleteBtn" alt="?????? ??????" onClick={handleDeleteBubble} />
						) : null}
					</div>

					<div className="comment-container">
						{bubbleComments.map((comment: any, i: number) => {
							console.log("?????? ?????????", comment);
							const commentId = comment.id;
							if (comment.user.email === userState.user.email) {
								return (
									<p key={i} className="my-comment" onDoubleClick={() => handleDeleteComment(commentId)}>
										{comment.textContent}
										<span className="my-nickname">??????????????? ?????????????????????.</span>
									</p>
								);
							} else {
								return (
									<p key={i} onDoubleClick={() => Swal.fire("  ", "????????? ??? ????????? ????????? ??? ????????????.")}>
										{comment.textContent}
										<span className="comment-user-nickname">{comment.user.nickname}</span>
									</p>
								);
							}
						})}
					</div>

					{isPlaying ? (
						<div className="bubbleDetail-bubble isPlaying">
							<img src={bubbleData.image} onClick={handleStopSound} className="bubbleImg" />
							<p>{bubbleData.textContent}</p>
						</div>
					) : (
						<div className="bubbleDetail-bubble">
							<img src={bubbleData.image} onClick={handlePlaySound} className="bubbleImg" />
							<p>{bubbleData.textContent}</p>
						</div>
					)}

					<div className="form">
						<label>
							<input
								type="text"
								name="comment"
								placeholder={
									userState.user.id === -1
										? "????????? ??????????????? ???????????? ???????????????"
										: "????????? ??????????????? (?????? + Enter)"
								}
								onChange={e => setCommentInput(e.target.value)}
								value={commentInput}
								// disabled={userState.user.id === -1 ? true : false}
								readOnly={userState.user.id === -1 ? true : false}
								onKeyPress={e => {
									if (e.key === "Enter") {
										handleSubmitComment(commentInput);
									}
								}}
								onClick={handleCommentClick}
							/>
						</label>
					</div>
					<div className="bubble-user">
						<p>{bubbleData.user.nickname}?????? Sound Bubble</p>
					</div>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default BubbleDetail;
