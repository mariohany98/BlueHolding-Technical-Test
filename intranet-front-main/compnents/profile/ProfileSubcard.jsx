import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { TbEdit } from "react-icons/tb";
import { FaTrashAlt } from 'react-icons/fa';

import Styles from "./ProfileSubcard.module.css";
import { uiActions } from "@/store/ui-slice";
import { profileActions } from "@/store/profile-slice";
import { useEffect, useState } from "react";

export default function ProfileSubcard({ detail, imgAlt, content, toggleEdit }) {
  const [transformedDate, setTransformedDate] = useState({
    start_date: '',
    end_date: ''
  });
  const [companyName, setCompanyName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const dispatch = useDispatch();
  const startDate = new Date(detail.start_date);
  const endDate = new Date(detail.end_date);
  const modified_startDate = `${startDate.toLocaleString('default', { month: 'long' }).substring(0, 3)} ${startDate.getFullYear()}`;
  const modified_endDate = `${endDate.toLocaleString('default', { month: 'long' }).substring(0, 3)} ${endDate.getFullYear()}`;
  const companies = useSelector(state => state.profile.profileFeatures[0].companies);
  const colleges = useSelector(state => state.profile.profileFeatures[1].colleges);
  const jobtypes = ['Full Time', 'Part Time', 'Internship'];
  let Coll_Comp_index = null;
  
  useEffect(() => {
    if( content === 'edit-experience' || content === 'edit-education' ) {
      setTransformedDate(prevState => ({ start_date: modified_startDate, end_date: modified_endDate }));
    }
    else if( content === 'edit-license-certification' ) {
      setTransformedDate(prevState => ({ start_date: modified_startDate, end_date: modified_endDate }));
    }
  }, [detail.start_date, detail.end_date]);

  useEffect(() => {
    if( detail.company_id ) {
      Coll_Comp_index = companies.findIndex(element => element.id === detail.company_id);
      setCompanyName(companies[Coll_Comp_index].name);
    } else if(detail.college_id) {
      Coll_Comp_index = colleges.findIndex(element => element.id === detail.college_id);
      setCollegeName(colleges[Coll_Comp_index].name);
    }
  }, [detail.company_id]);

  function editHandler() {
    dispatch(profileActions.selectSubFeature({id: detail.id, content}))
    dispatch(uiActions.openPopups({popupType: 'profile', mode: 'edit', content}));
  }

  function deleteHandler() {
    dispatch(profileActions.selectSubFeature({id: detail.id, content}));
    dispatch(uiActions.openPopups({ popupType: "deleteSubFeature", mode: 'delete', content }));
  }


  return (
    <div className="d-flex justify-content-between mb-4">
      <div className={Styles.SubcardContainer}>
        <div>
          <Image
            src={detail.company ? detail.company.image_path : detail.college ? detail.college.image_path : '/images/defaultProfile.jpg'}
            width={50}
            height={50}
            alt='Image'
          />
        </div>
        <div>
          <h5>{
            detail.title ? detail.title : 
            detail.college?.name ? detail.college.name : 
            detail.college_name ? detail.college_name : 
            detail.college_id ? collegeName : 
            null}</h5>
          <small>
            {
              detail.company?.name ? detail.company.name : 
              detail.company_name ? detail.company_name : 
              detail.company_id ? companyName : 
              null // detail.major
            }
            { 
              typeof detail.type === 'string' ? ` - ${detail.type}` : 
              typeof detail.type === 'number' ? ` - ${jobtypes[detail.type - 1]}` : 
              detail.major && detail.degree ? `${detail.major} - ${detail.degree}` : 
              detail.major && detail.confirmation_link ? `${detail.major} - ${detail.confirmation_link}` : 
              detail.major ? detail.major :
              detail.confirmation_link ? detail.confirmation_link : ''
            }
          </small>
          <small>
            { content !== 'edit-profile' && `${transformedDate.start_date} - ` }
            { detail.is_current && content === 'edit-experience' ? 'present' : transformedDate.end_date }
            { detail.duration ? ` - ${detail.duration}` : null  }
          </small>
        </div>
      </div>
      {
        toggleEdit && <div className={`${Styles.iconConatiner} text-nowrap`}>
          <button type="button" onClick={editHandler}>
            <TbEdit />
          </button>
          <button type="button" onClick={deleteHandler}>
            <FaTrashAlt />
          </button>
        </div>
      }
    </div>
  );
}
