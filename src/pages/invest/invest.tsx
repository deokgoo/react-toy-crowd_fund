import React, { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { deposit, getFundingInfo } from '../../services/fundingService';
import styles from './invest.module.scss';

const Invest = () => {
  const [info, setInfo] = useState<any>();
  const [money, setMoney] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const history = useHistory();
  const params = useParams<{id: string}>();

  const onClick = async () => {
    try {
      await deposit({payload: { fid: params.id, money: inputRef.current?.value, msg: msgRef.current?.value }});
      history.push(`/funding/${params.id}`);
    } catch(err) {
      console.log(err);
    }
  }
  const addMoney = async (money: number) => {
    if (!inputRef.current) return;
    const sum = inputRef.current.value.match(/\d+/) ? parseInt(inputRef.current.value) + money : money;
    inputRef.current.value = String(sum);
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFundingInfo(params.id);
      setInfo(data);
    };
    fetchData();
  }, [params]);
  const numericVerify = (evt: React.FormEvent<HTMLInputElement>) => {
    const regex = /^[0-9]+$/
    if(!regex.test(evt.currentTarget.value)) {
      setMoney(0);
    }else {
      setMoney(parseInt(evt.currentTarget.value));
    }

  }
  return (
    <div className={styles.invest}>
      <div className={styles.container}>
        <h1 className={styles.title}>{info?.title}</h1>
        <h2 className={styles.desc}>{info?.desc}</h2>
        <div className={styles.label}>金額</div>
        <div className={styles.form}>
          <input className={styles.input} min="0" ref={inputRef} onChange={numericVerify} value={money}/>
          <div className={styles.unit}>円</div>
        </div>
        <div className={styles.amountContainer}>
          <button className={styles.amount} onClick={() => addMoney(1000)}>+ 1,000</button>
          <button className={styles.amount} onClick={() => addMoney(5000)}>+ 5,000</button>
          <button className={styles.amount} onClick={() => addMoney(10000)}>+ 10,000</button>
          <button className={styles.amount} onClick={() => addMoney(20000)}>+ 20,000</button>
        </div>
        <div className={styles.msgContainer}>
          <h3 className={styles.msgTitle}>メッセージ</h3>
          <textarea name="msg" id="msg" className={styles.msg} ref={msgRef} />
        </div>
        <button className={styles.btn} onClick={onClick}>入金</button>
      </div>
    </div>
  );
}

export default Invest;
