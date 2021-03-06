import React, { useState } from "react";
import "./Styles/UploadLimitModal.css";

const UploadLimitModal = ({ handleLimitModal }: any): JSX.Element => {
	return (
		<>
			<div className="need-login-background">
				<div className="need-login-box">
					<div className="need-login-top-bar">
						<button className="need-login-close-btn" onClick={handleLimitModal}>
							๐ซ
						</button>
					</div>
					<p className="need-login-message">ํผ์๋ธ ์ฌ์ด๋ ์๋ก๋ ๊ธฐ๋ฅ์ ์ค๋น์ค์๋๋ค.</p>
					<p className="need-login-message">์กฐ๊ธ๋ง ๊ธฐ๋ค๋ ค์ฃผ์ธ์!</p>
					<div className="need-login-bottom-bar"></div>
				</div>
			</div>
		</>
	);
};

export default UploadLimitModal;
