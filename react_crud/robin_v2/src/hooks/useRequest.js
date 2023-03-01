import { useCallback, useState } from "react";

const useRequest = (asyncFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (options) => {
      setLoading(true);
      setData(null);
      setError(null);
      return asyncFunction(options)
        .then((response) => {
          // 请求成功时，将数据写进 state，设置 loading 为 false
          setData(response);
          setLoading(false);
          return response;
        })

        .catch((err) => {
          // 请求失败时，设置 loading 为 false，并设置错误状态
          setError(err);
          setLoading(false);
        });
    },
    [asyncFunction]
  );

  return { execute, loading, data, error };
};

export default useRequest;
