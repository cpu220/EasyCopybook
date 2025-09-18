import { useModel } from 'umi';

const ContentBox: React.FC = (): React.ReactNode => {

   const { user } = useModel('CONTENT');

  return (
    <div>
      这里是内容展示区
      {user}
    </div>
  );
}

export default ContentBox; 