import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { FaTrashAlt } from 'react-icons/fa';
import { useMutation } from 'react-query';
import { Toastify } from '@/libs/Toasts';

import styles from './EditProfile.module.css';
import { profileActions } from '@/store/profile-slice';
import { uiActions } from '@/store/ui-slice';
import ProfileServices from '@/services/ProfileService';

export default function EditAccount() {
    const [imageProfile, setImageProfile] = useState({ image_path: null });
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [filteredColleges, setFilteredColleges] = useState([]);
    const dispatch = useDispatch();
    const profileStatus = useSelector(state => state.ui.profilePopup);
    const profile = useSelector(state => state.profile);
    const companies = profile.profileFeatures[0].companies;
    const colleges = profile.profileFeatures[1].colleges;

    // const [paths, setPaths] = useState([]);
    const isUserContent = profileStatus.content === 'edit-profile';
    const isExperienceContent = profileStatus.content === 'edit-experience';
    const isEducationContent = profileStatus.content === 'edit-education';
    const isLicenseContent = profileStatus.content === 'edit-license-certification';
    const infoSelected = { id: profile.selectedSubFeatureID, content: profile.selectedSubFeatureContent }

    const profile_DV = {
        title: '',
        phone: '',
        image: ''
    }
    const experience_DV = {
        title: '',
        type: 1,
        company: '',
        start_date: {
            startMonth: 'Month',
            startYear: 'Year'
        },
        is_current: false,
        end_date: {
            endMonth: 'Month',
            endYear: 'Year'
        }
    }
    const eduction_DV = {
        school: '',
        degree: '',
        major: '',
        start_date: {
            startMonth: 'Month',
            startYear: 'Year'
        },
        end_date: {
            endMonth: 'Month',
            endYear: 'Year'
        }
    }
    const license_DV = {
        school: '',
        major: '',
        confirmation_link: '',
        start_date: {
            startMonth: 'Month',
            startYear: 'Year'
        },
        end_date: {
            endMonth: 'Month',
            endYear: 'Year'
        }
    }
    const formControls = `${isExperienceContent ? experience_DV :
        isEducationContent ? eduction_DV :
            isLicenseContent ? license_DV :
                profile_DV
        }`
    const { register, handleSubmit, formState, watch, setValue, reset } = useForm({ defaultValues: formControls });
    const { errors } = formState;

    function getStateForEdit() {
        const featureIndex = profile.profileFeatures.findIndex(feature => feature.content === infoSelected.content);
        const subFeatureIndex = profile.profileFeatures[featureIndex].subFeatures.findIndex(
            subFeature => subFeature.id === infoSelected.id
        );
        return profile.profileFeatures[featureIndex].subFeatures[subFeatureIndex];
    }

    useEffect(() => {
        if (isUserContent && profileStatus.mode === 'edit') {
            setValue('title', profile.user.title);
            setValue('phone', profile.user.mobile);
            setValue('image', profile.user.image);
            // setPaths([{ preview: profile.user.image_path }])
        } else if (isExperienceContent && profileStatus.mode === 'edit') {
            setValue('title', getStateForEdit().title);
            setValue('type', getStateForEdit().type);
            if( getStateForEdit().company_id ) {
                let companyIndex = companies.findIndex(element => element.id === getStateForEdit().company_id);
                setValue('company', companies[companyIndex].name);
            } else setValue(
                'company', getStateForEdit().company.name ? getStateForEdit().company.name : getStateForEdit().company_name
                );
            setValue('is_current', getStateForEdit().is_current);
            setValue('start_date.startMonth', monthNames[new Date(getStateForEdit().start_date).getMonth() + 1]);
            setValue('start_date.startYear', new Date(getStateForEdit().start_date).getFullYear());
            setValue('end_date.endMonth', monthNames[new Date(getStateForEdit().end_date).getMonth() + 1]);
            setValue('end_date.endYear', new Date(getStateForEdit().end_date).getFullYear());
        } else if (isEducationContent && profileStatus.mode === 'edit') {
            if( getStateForEdit().college.id ) {
                let collegeIndex = colleges.findIndex(element => element.id === getStateForEdit().college.id);
                setValue('school', colleges[collegeIndex].name);
            } else setValue('school', getStateForEdit().college.name);
            setValue('degree', getStateForEdit().degree);
            setValue('major', getStateForEdit().major);
            setValue('start_date.startMonth', monthNames[new Date(getStateForEdit().start_date).getMonth() + 1]);
            setValue('start_date.startYear', new Date(getStateForEdit().start_date).getFullYear());
            setValue('end_date.endMonth', monthNames[new Date(getStateForEdit().end_date).getMonth() + 1]);
            setValue('end_date.endYear', new Date(getStateForEdit().end_date).getFullYear());
        } else if (isLicenseContent && profileStatus.mode === 'edit') {
            if( getStateForEdit().college.id ) {
                let collegeIndex = colleges.findIndex(element => element.id === getStateForEdit().college.id);
                setValue('school', colleges[collegeIndex].name);
            } else setValue('school', getStateForEdit().college.name);
            setValue('major', getStateForEdit().major);
            setValue('confirmation_link', getStateForEdit().confirmation_link);
            setValue('start_date.startMonth', monthNames[new Date(getStateForEdit().start_date).getMonth() + 1]);
            setValue('start_date.startYear', new Date(getStateForEdit().start_date).getFullYear());
            setValue('end_date.endMonth', monthNames[new Date(getStateForEdit().end_date).getMonth() + 1]);
            setValue('end_date.endYear', new Date(getStateForEdit().end_date).getFullYear());
        }
    }, [profileStatus.mode]);
    // Dynamic initial form state

    // Dropdown Options
    const monthNames = ["Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const yearArr = ["Year"];
    if (!isUserContent)
        for (let year = new Date().getFullYear(); year >= new Date().getFullYear() - 100; year--) yearArr.push(year);
    // Dropdown Options

    // Upload Image
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            setValue('image', acceptedFiles[0]);
            const profileImagePath = acceptedFiles.map(file => ({ preview: URL.createObjectURL(file) }));
            setImageProfile(prevState => ({ image_path: profileImagePath[0].preview }));
        }
    });
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': []
        }, onDrop
    });
    // Upload Image

    const {
            isSuccess: isMutationSuccess, 
            isLoading: isMutationLoading, 
            isError: isMutationError, 
            mutate: submitMutationForm
        } = useMutation(async (profileData) => {
        return await ProfileServices.editProfile({
            mode: profileStatus.mode === 'edit' && isUserContent ? 'add' : profileStatus.mode,
            url: isExperienceContent && profileStatus.mode === 'add' ? 'experiences' :
                isExperienceContent && profileStatus.mode === 'edit' ? `experiences/${infoSelected.id}` :
                    isEducationContent && profileStatus.mode === 'add' ? 'educations' :
                        isEducationContent && profileStatus.mode === 'edit' ? `educations/${infoSelected.id}` :
                            isLicenseContent && profileStatus.mode === 'add' ? 'certifications' :
                                isLicenseContent && profileStatus.mode === 'edit' ? `certifications/${infoSelected.id}` :
                                    isUserContent ? 'profile' : 
                                        null,
            data: profileData,
            token: profile.user.authorisation.token
        });
    },
    {
        onSuccess: (res, incomingData) => {
            dispatch(uiActions.clossPopups());
            reset();
            add_or_edit_Handler(res.data.data, incomingData);
            Toastify('success', res.data.message);
        },
        onError: (err) => {
            for (const key in err.response?.data.data) {
            if (err.response?.data.data.hasOwnProperty(key)) {
                const messages = err.response?.data.data[key];
                messages.forEach(message => {
                Toastify('error', message);
                });
            }
            }
        },
    }
    );

    const searchedCompany = watch('company') === undefined ? '' : watch('company');
    const searchedCollege = watch('school') === undefined ? '' : watch('school');

    function filterCompaniesHanlder() {
        setFilteredCompanies(
            companies.filter(company => company.name.toLowerCase().includes(searchedCompany.toString().toLowerCase()))
        );
    }
    function filterCollegesHanlder() {
        setFilteredColleges(
            colleges.filter(college => college.name.toLowerCase().includes(searchedCollege.toString().toLowerCase()))
        );
    }

    function add_or_edit_Handler(resData, incomingData) {
        let requestBody = {
            content: profileStatus.content, 
            feature: isExperienceContent ? 
            {
                ...incomingData,
                id: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].id,
                duration: isExperienceContent ? resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].duration : null,
                company: {
                    id: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].company.id,
                    name: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].company.name,
                    image_path: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].company.image_path
                }
            } : !isUserContent ?
            {
                ...incomingData,
                id: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].id,
                college: {
                    id: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].college.id,
                    name: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].college.name,
                    image_path: resData[`${isExperienceContent ? 'experience' : isEducationContent ? 'education': isLicenseContent ? 'certification' : null}`].college.image_path
                }
            } :
            {
                title: resData.user.title,
                mobile: resData.user.mobile,
                image_path: resData.user.image_path
            }
        }
        if( profileStatus.mode === 'add' ) dispatch(profileActions.addFeature(requestBody));
        else if( profileStatus.mode === 'edit' ) dispatch(profileActions.editProfile(requestBody));
    }

    function submitHandler(formData) {
        let clonedFormData = structuredClone(formData);
        if (!isUserContent) {
            clonedFormData.start_date = `${clonedFormData.start_date.startYear}-${monthNames.indexOf(clonedFormData.start_date.startMonth) < 9 ? '0' + monthNames.indexOf(clonedFormData.start_date.startMonth) : monthNames.indexOf(clonedFormData.start_date.startMonth)}-15`;
            clonedFormData.end_date = clonedFormData.is_current ? null : `${clonedFormData.end_date.endYear}-${monthNames.indexOf(clonedFormData.end_date.endMonth) < 9 ? '0' + monthNames.indexOf(clonedFormData.end_date.endMonth) : monthNames.indexOf(clonedFormData.end_date.endMonth)}-15`;
            if (isExperienceContent) {
                clonedFormData.type = +clonedFormData.type;
                let companyIsExisted = companies.find(companyObj => companyObj.name === clonedFormData.company);
                if (companyIsExisted) clonedFormData['company_id'] = companyIsExisted.id;
                else clonedFormData['company_name'] = clonedFormData['company'];
                delete clonedFormData['company'];
                clonedFormData.is_current = clonedFormData.is_current ? 1 : 0;
            } else if(isEducationContent || isLicenseContent) {
                let collegeIsExisted = colleges.find(collegeObj => collegeObj.name === clonedFormData.school);
                if (collegeIsExisted) clonedFormData['college_id'] = collegeIsExisted.id;
                else clonedFormData['college_name'] = clonedFormData['school'];
                delete clonedFormData['school'];
            }
        } else if (isUserContent) {
            let profileFormData = new FormData();
            profileFormData.append("_method", "PUT");
            if(clonedFormData['image']){
                profileFormData.append('image', clonedFormData['image']);
            }
            profileFormData.append('title', clonedFormData['title']);
            profileFormData.append('mobile', clonedFormData['phone']);
            submitMutationForm(profileFormData);
            return;
        }
        // Pause Sending request until finishing development
        submitMutationForm(clonedFormData);
    }
    return (
        <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <div className={styles.formContent}>
                {
                    isUserContent && <section className={`${styles.dropzoneWrapper} mb-4`}>
                        <div className='position-relative mb-3 text-center'>
                            <Image className='rounded-circle'
                                width={150}
                                height={150}
                                style={{ objectFit: "cover" }}
                                src={imageProfile.image_path ? imageProfile.image_path : profile.user.image_path}
                                alt='profile-image' />
                        </div>
                        <div className='d-flex justify-content-between mb-3'>
                            <div {...getRootProps({ className: `${styles.dropzone} d-flex align-items-center justify-content-center flex-column` })}>
                                <input id='image' {...getInputProps()} {...register('image')} />
                                <p className='text-center m-0'>Upload Photo</p>
                            </div>
                            <button type='button' onClick={() => setImageProfile(prevState => ({ image_path: '/images/default.jpeg' }))
                                // setPaths([{ preview: '/images/defaultProfile.jpg' }])
                            }>
                                <FaTrashAlt></FaTrashAlt>
                            </button>
                        </div>
                    </section>
                }

                {
                    !isUserContent && <div className='mb-3 position-relative'>
                        <label
                            className='mb-2'
                            htmlFor={`${isExperienceContent ? 'title' : (isLicenseContent || isEducationContent) ? 'school' : null}`}>
                            {
                                isLicenseContent ? 'Issuing Organization*' :
                                    isExperienceContent ? 'Title*' :
                                        isEducationContent ? 'School*' :
                                            null
                            }
                        </label>
                        <input
                            type='text'
                            id={`${(isLicenseContent || isEducationContent) ? 'school' : isExperienceContent ? 'title' : null}`}
                            autoComplete='off'
                            {...register(`${(isLicenseContent || isEducationContent) ? 'school' : isExperienceContent ? 'title' : null}`, {
                                required: {
                                    value: true,
                                    message: `${isLicenseContent ? 'Issuing Organization*' : isExperienceContent ? 'Title*' : isEducationContent ? 'School*' : null} field is required`
                                },
                                onChange: filterCollegesHanlder
                            })} />
                        <p className={`${styles.error} m-0`}>{errors?.[`${isLicenseContent ? 'name' : isExperienceContent ? 'title' : isEducationContent ? 'school' : 'name'}`]?.message}</p>
                        {
                        (isEducationContent || isLicenseContent) && searchedCollege.toString().length > 0 && <div className={`${styles.inputListParent} position-absolute w-100 mt-2`}>
                            <ul className={`${styles.inputList} p-0`}>
                                {
                                    filteredColleges.map((college, index) => <li key={index} onClick={() => {
                                        setValue('school', college.name);
                                        setFilteredColleges(prevState => []);
                                    }} className='p-3'>{college.name}</li>)
                                }
                            </ul>
                        </div>
                    }
                    </div>
                }

                {
                    isExperienceContent && <div className='mb-3'>
                        <label htmlFor='employmentType' className='mb-2'>Employment type*</label>
                        <select className='w-100' id="employmentType" {...register('type')}>
                            <option value={1}>Full Time</option>
                            <option value={2}>Part Time</option>
                            <option value={3}>Internship</option>
                        </select>
                    </div>
                }

                <div className='mb-3 position-relative'>
                    <label className='mb-2'
                        htmlFor={`
                            ${isUserContent ? 'title' : isExperienceContent ? 'company' : isEducationContent ? 'degree' : 'major'}`}>
                        {
                            isUserContent ? 'Title*' :
                                isExperienceContent ? 'Company name*' :
                                    isEducationContent ? 'Degree*' :
                                        'Major*'
                        }
                    </label>
                    <input type='text' id={`${isUserContent ? 'title' : isExperienceContent ? 'company' : isEducationContent ? 'degree' : 'major'}`} autoComplete='off' {...register(`${isUserContent ? 'title' : isExperienceContent ? 'company' : isEducationContent ? 'degree' : 'major'}`, {
                        required: {
                            value: true,
                            message: `${isUserContent ? 'Title*' : isExperienceContent ? 'Company name*' : isEducationContent ? 'Degree*' : 'Major*'} field is required`
                        },
                        onChange: isExperienceContent ? filterCompaniesHanlder : null
                    })} />
                    <p className={`${styles.error} m-0`}>{errors?.[`${isUserContent ? 'title' : isExperienceContent ? 'company' : isEducationContent ? 'degree' : 'major'}`]?.message}</p>
                    {
                        isExperienceContent && searchedCompany.toString().length > 0 && <div className='position-absolute w-100 mt-2'>
                            <ul className={`${styles.inputList} p-0`}>
                                {
                                    filteredCompanies.map((company, index) => <li key={index} onClick={() => {
                                        setValue('company', company.name);
                                        setFilteredCompanies(prevState => []);
                                    }} className='p-3'>{company.name}</li>)
                                }
                            </ul>
                        </div>
                    }
                </div>

                {
                    isEducationContent && <div className='mb-3'>
                        <label className='mb-2' htmlFor='major'>Field of study*</label>
                        <input type='text' id='major' autoComplete='off' {...register('major', {
                            required: {
                                value: true,
                                message: 'Field of study* field is required'
                            }
                        })} />
                        <p className={`${styles.error} m-0`}>{errors?.['major']?.message}</p>
                    </div>
                }

                {
                    !isUserContent &&
                    <Row className='mb-3'>
                        <Col sm={12} md={6}>
                            <div>
                                <label htmlFor='startMonth' className='mb-2'>Start Date*</label>
                                <select className='w-100' id="startMonth"
                                    {...register('start_date.startMonth', {
                                        validate: fieldValue => fieldValue === "Month" ? "Month* field is required" : null
                                    })
                                    }>
                                    {
                                        monthNames.map((month, index) => <option key={index} value={month}>{month}</option>)
                                    }
                                </select>
                                <p className={`${styles.error} m-0`}>{errors?.['start_date']?.startMonth?.message}</p>
                            </div>
                        </Col>
                        <Col sm={12} md={6}>
                            <div>
                                <label htmlFor='startYear' className='mb-2 invisible'>Start Date*</label>
                                <select className='w-100' id="startYear" {...register('start_date.startYear', {
                                    validate: fieldValue => fieldValue === "Year" ? "Year* field is required" : null
                                })
                                }>
                                    {
                                        yearArr.map((year, index) => <option key={index} value={year}>{year}</option>)
                                    }
                                </select>
                                <p className={`${styles.error} m-0`}>{errors?.['start_date']?.startYear?.message}</p>
                            </div>
                        </Col>
                    </Row>
                }

                {
                    isExperienceContent ?
                        <div className='mb-3'>
                            <input type='checkbox' className='me-3' id={`is_current`} autoComplete='off' {...register('is_current')} />
                            <span>I am currently working in this role</span>
                        </div> : null
                }

                {
                    (!watch('is_current') && isExperienceContent) || isEducationContent || isLicenseContent ?
                        <Row className={`mb-3`}>
                            <Col sm={12} md={6}>
                                <div>
                                    <label htmlFor='endMonth' className='mb-2'>End Date (or expected)*</label>
                                    <select className='w-100' id="endMonth" {...register('end_date.endMonth', {
                                        validate: fieldValue => fieldValue === "Month" ? "Month* field is required" :
                                            (+watch('end_date.endYear') === +watch('start_date.startYear') && monthNames.indexOf(fieldValue) < monthNames.indexOf(watch('start_date.startMonth'))) ? "End date can’t be earlier than start date" :
                                                null
                                    })
                                    }>
                                        {
                                            monthNames.map((month, index) => <option key={index} value={month}>{month}</option>)
                                        }
                                    </select>
                                    <p className={`${styles.error} m-0`}>{errors?.end_date?.endMonth?.message}</p>
                                </div>
                            </Col>
                            <Col sm={12} md={6}>
                                <div>
                                    <label htmlFor='endYear' className='mb-2 invisible'>End Date*</label>
                                    <select className='w-100' id="endYear" {...register('end_date.endYear', {
                                        validate: fieldValue => fieldValue === "Year" ? "Year* field is required" :
                                            fieldValue < +watch('start_date.startYear') ? 'End date can’t be earlier than start date' :
                                                null
                                    })
                                    }>
                                        {
                                            yearArr.map((year, index) => <option key={index} value={year}>{year}</option>)
                                        }
                                    </select>
                                    <p className={`${styles.error} m-0`}>{errors?.end_date?.endYear?.message}</p>
                                </div>
                            </Col>
                        </Row> : null
                }


                {
                    isLicenseContent || isUserContent ?
                        <div className='mb-3'>
                            <label htmlFor='title' className='mb-2'>
                                {
                                    isUserContent ? 'Phone*' : 'Credential URL*'
                                }
                            </label>
                            <input type='text' id={`title`} autoComplete='off' {...register(
                                isUserContent ? 'phone' : 'confirmation_link', {
                                required: {
                                    value: isUserContent ? true : false,
                                    message: `${isUserContent ? 'phone*' : 'Credential URL*'} field is required`
                                }
                            })} />
                            <p className={`${styles.error} m-0`}>{errors?.[isUserContent ? 'phone' : 'confirmation_link']?.message}</p>
                        </div> : null
                }

            </div>
            <footer className='d-flex flex-row-reverse'>
                <div className={styles.action}>
                    <button type='submit'>Confirm</button>
                </div>
            </footer>
        </form>
    )
}