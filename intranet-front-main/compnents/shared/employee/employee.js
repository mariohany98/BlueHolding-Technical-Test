import Image from "next/image";

import styles from './employee.module.css';

export default function Employee({eNum, eName, ePosition, eScore, eImagePath, crowned, bestFive}) {

    return (
        <tr>
            <td className={`${bestFive ? styles.empNum: styles.number}`}><span className="text-center">{ eNum }</span></td>
            <td className="text-center">
                { crowned && <Image src={crowned} width={26} height={26} alt='crown' className={`${styles.crown} position-relative`} /> }
                { crowned && <br /> }
                <Image src={eImagePath} width={32} height={32} alt={eName} className="rounded-circle" />
            </td>
            <td className={styles.content}>
                <p>{ eName }</p>
                <p>{ ePosition }</p>
            </td>
            <td className="text-center">
                <Image src='/dummy-images/star.png' width={14} height={14} alt="star" />
                <p>{ eScore }</p>
            </td>
        </tr>
    )
}