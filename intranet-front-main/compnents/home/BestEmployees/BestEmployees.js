import styles from './BestEmployees.module.css';
import Employee from "../../shared/employee/employee";
import { Fragment } from 'react';

export default function BestEmployees({ employees, bestFive, page, lastPage, setPage }) {
    return (
        <Fragment>
            <table 
                className={`${bestFive ? styles.bestFive : styles.empTable}`} 
                style={{
                    'borderBottomLeftRadius': bestFive ? '10px' : 'unset',
                    'borderBottomRightRadius': bestFive ? '10px' : 'unset'
                }}>
                <thead>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Name</td>
                        <td>Score</td>
                    </tr>
                </thead>
                <tbody>
                {
                    employees.map( (employee, index) => (
                        <Employee 
                            key={index}
                            bestFive={bestFive}
                            crowned={index === 0 && bestFive ? '/dummy-images/crown.png' : false}
                            eNum={bestFive ?  index + 1 : (index + 1 ) + ((page - 1) * 5)}
                            eName={employee.name} 
                            ePosition={employee.department.name} 
                            eScore={employee.global_score} 
                            eImagePath={employee.image_path} />
                    ))
                }
                </tbody>
            </table>
            {
                !bestFive && <table className={`${styles.empTableActions} text-center mb-3`}>
                    <tbody>
                        <tr>
                            <td>
                                <button 
                                    className={page === 1 ? styles.disabled : ''}
                                    onClick={()=>setPage(page - 1)}>Previous</button>
                            </td>
                            <td>{`${page} - ${lastPage}`}</td>
                            <td>
                                <button 
                                className={page === lastPage ? styles.disabled : ''}
                                    onClick={()=>setPage(page + 1)}>Next</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            }
        </Fragment>
    )
}