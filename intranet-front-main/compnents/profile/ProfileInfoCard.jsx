import { Container, Row, Col } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import ProfileSubcard from "./ProfileSubcard";
import Styles from "./ProfileInfoCard.module.css";
import { uiActions } from "@/store/ui-slice";
import { profileActions } from "@/store/profile-slice";

const ProfileInfoCard = ({ feature }) => {
  const router = useRouter();
  const [toggleEdit, setToggleEdit] = useState(false);
  const dispatch = useDispatch();

  function addSubFeatureHandler() {
    dispatch(profileActions.selectSubFeature({ id: null, content: feature.content }));
    dispatch(uiActions.openPopups({ popupType: 'profile', mode: 'add', content: feature.content }))
  }

  function getSubFeatures() {
    let subFeatures = router.query['id'] ? feature.visitedSubFeatures : feature.subFeatures;
    return (
      subFeatures.length > 0 ? subFeatures.map((detail, index) =>
      <ProfileSubcard key={index} detail={detail} imgAlt={feature.title} content={feature.content} toggleEdit={toggleEdit} />) : <p className="text-center m-0">No Items</p>
    );
  }

  return (
    <Container className={Styles.cardContainer}>
      <Row className={Styles.headerContainer}>
        <Col className="p-0 d-flex justify-content-between">
          <h4 className="mb-0">{feature.title}</h4>
          {
            !router.query['id'] && <div className={`${Styles.iconConatiner} text-nowrap`}>
              <button type="button" onClick={addSubFeatureHandler}>
                <FaPlus />
              </button>
              <button type="button" onClick={() => setToggleEdit(prevState => !prevState)}>
                <TbEdit />
              </button>
            </div>
          }
        </Col>
      </Row>
      <Row className={Styles.bodyContainer}>
        <Col className="p-0">{ getSubFeatures() }</Col>
      </Row>
    </Container>
  );
};

export default ProfileInfoCard;
