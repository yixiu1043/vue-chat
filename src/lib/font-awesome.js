import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome, faUser, faUserFriends, faDownload, faHandHoldingUsd,
  faMoneyCheckAlt, faWallet, faIdCard, faHandsHelping,
  faSignOutAlt, faQuestion, faHistory, faDollarSign, faTimes, faQrcode,
  faSignInAlt, faExclamationTriangle, faUserPlus, faRedoAlt, faHeadset,
  faChevronLeft, faArrowCircleUp, faCalendarAlt, faAngleRight,
  faUnlock, faPlus, faCoins, faAd, faChartLine, faListOl, faFileInvoiceDollar,
  faAngleDown, faKeyboard, faBullhorn, faCaretDown, faAngleLeft, faBars, faAngleDoubleLeft,
  faDiceSix, faDiceFive, faDiceFour, faDiceThree, faDiceTwo, faDiceOne, faServer, faBullseye,
  faMobileAlt, faChevronCircleDown, faStar, faTrophy, faAlignJustify, faUserShield, faFlagUsa,
  faExclamationCircle, faComments, faSyncAlt, faAngleDoubleRight, faPhone, faAngleUp, faArrowLeft,
  faArrowRight, faChevronRight, faMoneyCheck, faCommentSlash, faCommentAlt, faEyeSlash, faEye, faEllipsisH,
  faArrowUp, faImage, faSmile
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHome, faUser, faUserFriends, faDownload,
  faHandHoldingUsd, faMoneyCheckAlt, faWallet, faIdCard,
  faHandsHelping, faSignOutAlt, faQuestion,
  faHistory, faDollarSign, faTimes, faQrcode,
  faSignInAlt, faExclamationTriangle, faUserPlus,
  faRedoAlt, faHeadset, faChevronLeft, faArrowCircleUp,
  faCalendarAlt, faAngleRight, faUnlock, faPlus,
  faCoins, faAd, faChartLine, faListOl, faFileInvoiceDollar,
  faAngleDown, faKeyboard, faBullhorn, faCaretDown, faAngleLeft, faBars, faAngleDoubleLeft,
  faDiceSix, faDiceFive, faDiceFour, faDiceThree, faDiceTwo, faDiceOne, faServer, faBullseye,
  faMobileAlt, faChevronCircleDown, faStar, faTrophy, faAlignJustify, faUserShield, faFlagUsa,
  faExclamationCircle, faComments, faSyncAlt, faAngleDoubleRight, faPhone, faAngleUp, faArrowLeft,
  faArrowRight, faChevronRight, faMoneyCheck, faCommentSlash, faCommentAlt, faEyeSlash, faEye, faEllipsisH,
  faArrowUp, faImage, faSmile
);
// ellipsis-h
Vue.component('font-awesome-icon', FontAwesomeIcon);
