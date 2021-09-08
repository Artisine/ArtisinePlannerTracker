
/**
 * 
 * @param {string} query 
 * @returns HTMLElement;
 */
function queryElement(query) {
	return document.querySelector(query);
}




queryElement("#signin_signup-button").addEventListener("click", ()=>{
	queryElement("#signin_body-1").style.display = "none";
	queryElement("#signin_body-2").style.display = "block";
});
queryElement("#signup_back-button").addEventListener("click", ()=>{
	queryElement("#signin_body-2").style.display = "none";
	queryElement("#signin_body-1").style.display = "block";
});








// end of file