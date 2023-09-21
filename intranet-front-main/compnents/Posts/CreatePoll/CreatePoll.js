import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postsActions } from '@/store/posts-slice';
import { uiActions } from '@/store/ui-slice';

import styles from './CreatePoll.module.css';

export default function CreatePoll() {
    const pollData = useSelector(state => state.posts.postPoll);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState, control, setValue } = useForm({
        defaultValues: {
            question: '',
            options: [{ option: '' }, { option: '' }],
            duration: '1 day'
        }
    });
    const { fields, append, remove } = useFieldArray({
        name: 'options',
        control
    });
    const { errors } = formState;

    useEffect(() => {
        if( pollData.question?.length > 0 ) {
            setValue('question', pollData.question);
            setValue(`options`, pollData.options);
            setValue(`duration`, pollData.duration);
        }
    }, [pollData]);

    function autoSizeHandler(event) {
        setTimeout(() => {
            event.target.style.cssText = 'height: auto; padding: 0.75rem 1rem 0.75rem 1rem;';
            event.target.style.cssText = 'height:' + event.target.scrollHeight + 'px';
        }, 0);
    }

    function submitHandler(formData) {
        console.log('formData = ', formData);
        dispatch(postsActions.addPostPoll({postPoll: formData}));
        dispatch(uiActions.openPopups({popupType: 'main', content: 'post-poll'}));
    }
    
    return (
        <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <div className={styles.formContent}>
                <div className='mb-3'>
                    <label htmlFor='question' className='mb-2'>Your question*</label>
                    <textarea type='text' id='question' placeholder='What’s your favorite A.I Tool?' onKeyDown={autoSizeHandler.bind(this)} { ...register('question', {
                        required: {
                            value: true,
                            message: 'Question field is required'
                        }})
                    } />
                    
                    <p className={`${styles.error} m-0`}>{ errors?.question?.message }</p>
                </div>
                <div>
                    {
                        fields.map( (field, index) => {
                            return (
                                <div key={field.id} className={`${styles.option} mb-3`}>
                                    <div className='d-flex justify-content-between'>
                                        <label htmlFor={`option_${index + 1}`} className='mb-2'>Option {index + 1}*</label>
                                        { index > 1 && <button type='button' onClick={() => remove(index)}>Remove</button> }
                                    </div>
                                    <input type='text' id={`option_${index + 1}`} autoComplete='off' { ...register(`options.${index}.option`, {
                                        required: {
                                            value: true,
                                            message: 'Option field is required'
                                        }
                                    }) } />
                                    <p className={`${styles.error} m-0`}>{errors?.options?.[index]?.option?.message}</p> 
                                </div>
                            )
                        })
                    }
                    <button className='mb-3' type='button' onClick={() => append({option: ''})}>
                        <i className="fa-solid fa-plus"></i> <span>Add option</span>
                    </button>
                </div>

                <div>
                    <label htmlFor='duration' className='mb-2'>Poll Duration</label>
                    <select className='w-100' id="duration" { ...register('duration', {
                        required: {
                            value: true,
                            message: 'Duration field is required'
                        }})
                    }>
                        <option value="1 day">1 day</option>
                        <option value="3 days">3 days</option>
                        <option value="1 week">1 week</option>
                        <option value="2 weeks">2 weeks</option>
                    </select>
                    
                    <p className={`${styles.error} m-0`}>{ errors?.duration?.message }</p>
                </div>
            </div>
            <footer className='d-flex flex-row-reverse'>
                <div className={styles.action}>
                    <button type='submit'>Confirm</button>
                </div>
            </footer>
        </form>
    )
}