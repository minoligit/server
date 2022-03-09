import React, {useEffect,useState} from "react";
import '../App.css';
import Axios from 'axios';

function AboutMe() {

    const [user_name,setUserName] = useState("Minoli Fernando");
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        const str = {
            userName: user_name
        }
        Axios.post("http://localhost:8080/searchUser",str).then((res) => {
            setUserInfo(res.data);
        });
    }, []);

    const submitUser = (value) => {
        const str = {
            userName: value
        }
        Axios.post("http://localhost:8080/searchUser",str).then((res) => {
            setUserInfo(res.data);
        });
    };  

	return (
		<div><h1 className='App-header'>My App - About Me</h1><br/><br/>
            <div className="Content" id="aboutMe">
                <div>
                    <input id="searchBar" type="text" name="user_name" placeholder="Enter the username"
                    onChange={(e)=>{setUserName(e.target.value)}}/>
                    <button type="submit" value="submit"  className="btn btn-primary" 
                    onClick={submitUser(user_name)}>Search</button><br/>
                </div><br/><br/><br/><br/>
                {userInfo.map(data => (
                <div key={data.user_id} >
                <table>
                    <tr>
                        <td width="50%"></td>
                        <td  width="50%">
                            <div className='Introduction'>
                                {"Hii, Welcome to my page."}<br/>
                                {"I'm "+data.user_name+" from "+data.address+"."}<br/><br/>
                                {"You can view my information here."}
                            </div>
                        </td>
                    </tr>
                </table><br/><br/>
                <label>Occupation</label>{data.occupation}<br/><br/>
                <label>School/College</label>{data.school}<br/><br/>
                <label>Higher Education</label>{data.higherEdu}<br/><br/>
                <label>Work At</label>{data.workPlace}<br/><br/>
                </div>))}
            </div>
        </div>
	);
};

export default AboutMe;