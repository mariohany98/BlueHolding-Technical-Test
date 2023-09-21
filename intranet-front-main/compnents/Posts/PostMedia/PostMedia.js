import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import styles from './PostMedia.module.css';
import { postsActions } from '@/store/posts-slice';
import { Col, Row } from 'react-bootstrap';

export default function PostMedia() {
    const dispatch = useDispatch();
    const { files, paths, old_images, old_images_Req } = useSelector(state => state.posts.postMedia);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            const filesPaths = acceptedFiles.map(file => ({ ...file, preview: URL.createObjectURL(file) }));
            console.log('all files: ', [...files, ...acceptedFiles]);
            dispatch(postsActions.addPostMedia({
                files: [...files, ...acceptedFiles],
                paths: [...paths, ...filesPaths],
                old_images, 
                old_images_Req
            }));
        }
    });

    // paths                find by preview
    // files                find by path index from paths array
    // old_images           find by preview
    // old_images_Req       find by url

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        }, onDrop
    });

    function removeImageHanlder(blob_or_url) {
        dispatch(postsActions.removeImageFile({ blob_or_url: blob_or_url.preview }));
        // setImageFiles(prevFile => {
            // let newFiles = prevFile.files.filter((file, index) => index !== fileIndex);
            // sendFiles(newFiles);

            // return {
            //     files: newFiles,
            //     paths: prevFile.paths.filter((path, index) => index !== fileIndex)
            // }
            // return prevFile.filter((file, index) => index !== previewIndex.index)
        // });
        // acceptedFiles.splice(previewIndex.index, 1);
    }

    return (
        <section className={styles.dropzoneWrapper}>
            <div {...getRootProps({ className: `${styles.dropzone} d-flex align-items-center justify-content-center flex-column mb-3` })}>
                <input {...getInputProps()} />
                <i className="fa-regular fa-image mb-3"></i>
                <p>Add photos/videos</p>
                <p>or drag and drop</p>
            </div>
            <Row>
                {
                    [...old_images, ...paths].map((path, index) => (
                        <Col key={index} md={12} lg={6} xl={4}>
                            <div className='position-relative mb-4' style={{ height: "200px" }}>
                                <Image className='rounded'
                                    fill={true}
                                    style={{ objectFit: "cover" }}
                                    src={path.preview}
                                    alt='postImage' />
                                <button
                                    className='position-absolute end-0 m-2'
                                    onClick={removeImageHanlder.bind(this, path)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </Col>
                    ))
                }
            </Row>
        </section>
    );
}